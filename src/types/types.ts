import { Company, Event } from "@/types/database"

export type DetailCompany = Company & {
  events: Event[]
}
