import { client, db } from '.'
import { goalCompletions, goals } from './schema'
import dayjs from 'dayjs'

async function seed() {
  //Precisa ser nessa ordem, não da erro de FK
  await db.delete(goalCompletions)
  await db.delete(goals)

  const result = await db
    .insert(goals)
    .values([
      { title: 'Acordar cedo', desiredWeeklyFrenquency: 5 },
      { title: 'exercitar', desiredWeeklyFrenquency: 3 },
      { title: 'Meditar', desiredWeeklyFrenquency: 1 },
    ])
    .returning()

  const startOfWeek = dayjs().startOf('week')

  await db.insert(goalCompletions).values([
    { GoalId: result[0].id, createdAt: startOfWeek.toDate() },
    { GoalId: result[1].id, createdAt: startOfWeek.add(1, 'day').toDate() },
  ])
}

seed().finally(() => {
  client.end()
})
