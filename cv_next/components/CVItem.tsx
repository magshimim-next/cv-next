import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import CVModel from "@/types/cv"

interface CVCardProps {
  cv: CVModel
}

export default function CVItem({ cv }: CVCardProps) {
  return (
      <Card style={{ width: "30%", height: "30%" }}>
          <CardHeader>
          <img src={cv.documentUrl} alt="CV Preview" />
        <CardTitle>{cv.userId}</CardTitle>
      </CardHeader>
      <CardDescription>{cv.description}</CardDescription>
    </Card>
  )
}
