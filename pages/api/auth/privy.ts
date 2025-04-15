import { getServerSession } from 'next-auth';
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { privyId, email, walletAddress } = req.body;

        if (!privyId) {
            return res.status(400).json({ message: 'Privy ID is required' });
        }

        // Check if user already exists
        let user = await prisma.user.findUnique({
            where: { privyId },
        });

        if (!user) {
            // Create new user
            user = await prisma.user.create({
                data: {
                    privyId,
                    email,
                    walletAddress,
                },
            });
        } else {
            // Update existing user
            user = await prisma.user.update({
                where: { privyId },
                data: {
                    email,
                    walletAddress,
                },
            });
        }

        return res.status(200).json(user);
    } catch (error) {
        console.error('Error handling Privy user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
} 