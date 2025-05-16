import { Button, Dropdown, DropdownContent, DropdownTrigger, FaSortIcon } from "smarthr-ui"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

type SortField = {
  label: string
  value: string
}

const sortFields: SortField[] = [
  { label: "企業名", value: "name" },
  { label: "業種", value: "industry" },
  { label: "次回選考日時", value: "next_event_date" },
]

export const SortButton = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentSort = searchParams.get("sort") || "name"
  const currentOrder = searchParams.get("order") || "asc"

  const handleSort = (field: string) => {
    const params = new URLSearchParams(searchParams.toString())
    const newOrder = field === currentSort && currentOrder === "asc" ? "desc" : "asc"
    params.set("sort", field)
    params.set("order", newOrder)
    params.set("page", "1") // ソート時は1ページ目に戻す
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="secondary" suffix={<FaSortIcon />}>
          並び替え
        </Button>
      </DropdownTrigger>
      <DropdownContent>
        <div style={{ padding: "8px" }}>
          {sortFields.map((field) => (
            <Button
              key={field.value}
              variant="text"
              onClick={() => handleSort(field.value)}
              style={{
                display: "block",
                width: "100%",
                textAlign: "left",
                marginBottom: "4px",
              }}
            >
              {field.label}
              {currentSort === field.value && (
                <span style={{ marginLeft: "8px" }}>
                  {currentOrder === "asc" ? "↑" : "↓"}
                </span>
              )}
            </Button>
          ))}
        </div>
      </DropdownContent>
    </Dropdown>
  )
}
