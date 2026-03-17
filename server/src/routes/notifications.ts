import express, { RequestHandler } from 'express';
import { Request, Response } from 'express';
import { prisma } from '../utils/prisma';
import Logger from '../utils/logger';

// In-memory map to store SSE connections by studentId
const sseConnections = new Map<string, Response[]>();

// SSE endpoint for real-time notifications
export const notificationStream = async (req: Request, res: Response) => {
  try {
    // Extract token from query parameter (EventSource doesn't support custom headers)
    const { token } = req.query;
    
    if (!token || typeof token !== 'string') {
      return res.status(401).json({ message: 'Token is required' });
    }

    // Verify token and get student info
    const student = await prisma.student.findFirst({
      where: {
        id: token // For simplicity, using studentId as token for SSE
      }
    });

    if (!student) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Set SSE headers
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    });

    // Store the connection
    const studentId = student.id;
    if (!sseConnections.has(studentId)) {
      sseConnections.set(studentId, []);
    }
    sseConnections.get(studentId)!.push(res);

    Logger.info(`SSE connection established for student: ${studentId}`);

    // Send initial connection event
    res.write('event: connected\ndata: {"message": "Connected to notification stream"}\n\n');

    // Send ping every 30 seconds to keep connection alive
    const pingInterval = setInterval(() => {
      try {
        res.write('event: ping\ndata: {"type": "ping"}\n\n');
      } catch (error) {
        // Connection closed, clean up
        clearInterval(pingInterval);
        cleanupConnection(studentId, res);
      }
    }, 30000);

    // Clean up on connection close
    req.on('close', () => {
      clearInterval(pingInterval);
      cleanupConnection(studentId, res);
      Logger.info(`SSE connection closed for student: ${studentId}`);
    });

  } catch (error) {
    Logger.error('SSE connection error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper function to clean up closed connections
const cleanupConnection = (studentId: string, response: Response) => {
  const connections = sseConnections.get(studentId);
  if (connections) {
    const index = connections.indexOf(response);
    if (index > -1) {
      connections.splice(index, 1);
    }
    if (connections.length === 0) {
      sseConnections.delete(studentId);
    }
  }
};

// Function to send notification to a specific student
export const sendNotificationToStudent = (studentId: string, notification: any) => {
  const connections = sseConnections.get(studentId);
  if (connections && connections.length > 0) {
    const data = JSON.stringify(notification);
    connections.forEach(res => {
      try {
        res.write(`event: notification\ndata: ${data}\n\n`);
      } catch (error) {
        // Connection closed, will be cleaned up on next ping
      }
    });
    Logger.info(`Notification sent to ${connections.length} connections for student: ${studentId}`);
  }
};

// Export the connections map for use in other controllers
export { sseConnections };

// Create and export the router
const router = express.Router();
router.get('/stream', notificationStream as RequestHandler);
export default router;
