import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Create Admin User
  const hashedPassword = await bcrypt.hash('password123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
      image: faker.image.avatar(),
    },
  })

  console.log({ admin })

  // Create Categories
  const categories = []
  for (let i = 0; i < 5; i++) {
    const name = faker.commerce.department() + ' ' + faker.string.alphanumeric(3)
    const category = await prisma.category.upsert({
      where: { name },
      update: {},
      create: {
        name,
        slug: faker.helpers.slugify(name).toLowerCase(),
      },
    })
    categories.push(category)
  }

  // Create Tags
  const tags = []
  for (let i = 0; i < 10; i++) {
    const name = faker.word.noun() + ' ' + faker.string.alphanumeric(3)
    const tag = await prisma.tag.upsert({
      where: { name },
      update: {},
      create: {
        name,
        slug: faker.helpers.slugify(name).toLowerCase(),
      },
    })
    tags.push(tag)
  }

  // Create Posts
  for (let i = 0; i < 20; i++) {
    const title = faker.lorem.sentence()
    const slug = faker.helpers.slugify(title).toLowerCase() + '-' + faker.string.alphanumeric(5)
    
    await prisma.post.create({
      data: {
        title,
        slug,
        content: faker.lorem.paragraphs(5),
        excerpt: faker.lorem.sentence(),
        published: faker.datatype.boolean(),
        image: faker.image.urlLoremFlickr({ category: 'nature' }),
        authorId: admin.id,
        categoryId: categories[Math.floor(Math.random() * categories.length)].id,
        tags: {
          connect: tags.slice(0, 3).map(t => ({ id: t.id })),
        },
      },
    })
  }

  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
