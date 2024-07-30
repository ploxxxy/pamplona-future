import { ChallengeType, PrismaClient } from '@prisma/client'
import namedChallenges from './resources/namedChallenges.json'

export async function seed(prisma: PrismaClient) {
  await prisma.$transaction(
    namedChallenges.map((namedChallenge) => {
      return prisma.challenge.create({
        data: {
          id: namedChallenge.id,
          contentId: namedChallenge.contentId,
          challengeType: namedChallenge.challengeType as ChallengeType,
          challengeStats: {
            connectOrCreate: namedChallenge.challengeStats.map(
              (challengeStat: string) => ({
                where: { code: challengeStat },
                create: { code: challengeStat },
              })
            ),
          },
        },
      })
    })
  )
}
