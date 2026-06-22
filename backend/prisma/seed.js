import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { pengurus, berita, prestasi } from '../src/data/mockDB.js'

const databaseUrl = process.env.DATABASE_URL || 'file:./dev.db'
const adapter = new PrismaBetterSqlite3({ url: databaseUrl })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('Clearing database...')
  await prisma.pengurus.deleteMany()
  await prisma.berita.deleteMany()
  await prisma.prestasi.deleteMany()

  console.log('Seeding pengurus...')
  for (const p of pengurus) {
    await prisma.pengurus.create({
      data: {
        id: p.id,
        role: p.role,
        name: p.name,
        description: p.description
      }
    })
  }

  console.log('Seeding berita...')
  for (const b of berita) {
    await prisma.berita.create({
      data: {
        id: b.id,
        title: b.title,
        date: b.date,
        content: b.content,
        image: b.image
      }
    })
  }

  console.log('Seeding prestasi...')
  for (const pr of prestasi) {
    await prisma.prestasi.create({
      data: {
        id: pr.id,
        title: pr.title,
        year: pr.year,
        description: pr.description
      }
    })
  }

  console.log('Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
