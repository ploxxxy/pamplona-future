import { PrismaClient } from '@prisma/client'
import { PamRunnerKitDefinitionsMeta } from './resources/RunnerKitDefinitionsMeta.json'

// TODO: change to customization from
// UI/Art/PlayerTags (no echoes)
// Gameplay/Social/PlayerTagDefinitions (no echoes)
export async function main(prisma: PrismaClient) {
  const kitTypes = PamRunnerKitDefinitionsMeta.RunnerKitTypes.member.map(
    (kitType) => ({
      id: kitType.PamRunnerKitTypeMeta.KitTypeGuid,
      name: kitType.PamRunnerKitTypeMeta.DisplayName,
    })
  )

  const runnerKits = PamRunnerKitDefinitionsMeta.RunnerKits.member.map(
    (kit) => ({
      id: kit.PamRunnerKitMeta.KitGuid,
      kitType: kit.PamRunnerKitMeta.KitTypeGuid,
      name: kit.PamRunnerKitMeta.RewardDescriptionSid,
      rewards: Array.isArray(kit.PamRunnerKitMeta.Rewards.member)
        ? kit.PamRunnerKitMeta.Rewards.member.map((reward) => ({
            id: reward.PamRunnerKitRewardMeta.Hash.toString(),
            name: reward.PamRunnerKitRewardMeta.Name,
          }))
        : [
            {
              id: kit.PamRunnerKitMeta.Rewards.member.PamRunnerKitRewardMeta.Hash.toString(),
              name: kit.PamRunnerKitMeta.Rewards.member.PamRunnerKitRewardMeta
                .Name,
            },
          ],
    })
  )

  const initialRewards = PamRunnerKitDefinitionsMeta.InitialRewards.member.map(
    (reward) => ({
      id: reward.PamRunnerKitRewardMeta.Hash.toString(),
      name: reward.PamRunnerKitRewardMeta.Name,
    })
  )

  await prisma.kitType.createMany({
    data: kitTypes,
  })

  await prisma.item.createMany({
    data: initialRewards,
  })

  await prisma.$transaction(
    runnerKits.map((kit) => {
      return prisma.kit.create({
        data: {
          id: kit.id,
          name: kit.name,
          kitTypeRelation: {
            connect: { id: kit.kitType },
          },
          rewards: {
            connectOrCreate: kit.rewards.map((reward) => ({
              where: { id: reward.id },
              create: { id: reward.id, name: reward.name },
            })),
          },
        },
      })
    })
  )
}
