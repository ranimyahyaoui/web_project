import { prisma } from '../lib/prisma.js';

export const send = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;
    await prisma.contactMessage.create({
      data: { name, email, subject, message },
    });
    return res
      .status(201)
      .json({ message: 'Message envoyé. Le bureau vous répondra par e-mail.' });
  } catch (error) {
    return next(error);
  }
};
