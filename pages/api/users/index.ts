import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import authOptions from '../auth/[...nextauth]';

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    switch (req.method) {
        case 'GET':
            return handleGet(req, res);
        case 'POST':
            return handlePost(req, res);
        case 'PUT':
            return handlePut(req, res);
        case 'DELETE':
            return handleDelete(req, res);
        default:
            return res.status(405).json({ message: 'Method not allowed' });
    }
}

async function handleGet(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { privyId } = req.query;

        if (privyId) {
            const user = await prisma.user.findUnique({
                where: { privyId: privyId as string },
            });

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.status(200).json(user);
        }

        const users = await prisma.user.findMany();
        return res.status(200).json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function handlePost(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { privyId, name, email, walletAddress } = req.body;

        if (!privyId) {
            return res.status(400).json({ message: 'Privy ID is required' });
        }

        const existingUser = await prisma.user.findUnique({
            where: { privyId },
        });

        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const user = await prisma.user.create({
            data: {
                privyId,
                name,
                email,
                walletAddress,
            },
        });

        return res.status(201).json(user);
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function handlePut(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { privyId, name, email, walletAddress } = req.body;

        if (!privyId) {
            return res.status(400).json({ message: 'Privy ID is required' });
        }

        const user = await prisma.user.update({
            where: { privyId },
            data: {
                name,
                email,
                walletAddress,
            },
        });

        return res.status(200).json(user);
    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { privyId } = req.query;

        if (!privyId) {
            return res.status(400).json({ message: 'Privy ID is required' });
        }

        await prisma.user.delete({
            where: { privyId: privyId as string },
        });

        return res.status(204).end();
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
} 