import { Company } from '@/types/database'
import { faker } from '../utils/faker' 

type FakeCompanyProps = {
  userId?: string
}

export const fakeCompany = (props?: FakeCompanyProps) => {
  if (!props?.userId) {
    throw new Error("userId is required")
  }

  const result: Company = {
    id: faker.string.uuid(),
    name: faker.company.name(),
    industry: faker.helpers.arrayElement(["IT", "金融", "医療", "教育", "不動産", "その他"]),
    status: faker.helpers.arrayElement(["エントリー前", "選考中", "内定", "お見送り", "辞退"]),
    website_url: "https://example.com",
    created_at: faker.date.between({ from: '2020-01-01T00:00:00.000Z', to: '2030-01-01T00:00:00.000Z' }).toISOString(),
    updated_at: faker.date.between({ from: '2020-01-01T00:00:00.000Z', to: '2030-01-01T00:00:00.000Z' }).toISOString(),
    notes: faker.lorem.paragraph(),
    user_id: props?.userId,
  }

  return result
}