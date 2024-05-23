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

  const allRewards = [
    ...initialRewards,
    ...runnerKits.flatMap((kit) => kit.rewards),
  ]

  await prisma.kitType.createMany({
    data: kitTypes,
    skipDuplicates: true,
  })

  await prisma.kit.createMany({
    data: runnerKits.map((kit) => ({
      id: kit.id,
      kitType: kit.kitType,
      name: kit.name,
    })),
    skipDuplicates: true,
  })

  await prisma.item.createMany({
    data: allRewards,
    skipDuplicates: true,
  })
}
