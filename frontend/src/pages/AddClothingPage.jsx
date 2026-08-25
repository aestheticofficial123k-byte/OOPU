import { useNavigate } from "react-router-dom"
import AddClothingForm from "../components/clothing/AddClothingForm"

export default function AddClothingPage() {
  const navigate = useNavigate()

  return (
    <div className="page max-w-2xl mx-auto">
      <h1 className="page-title">Add Clothing</h1>
      <p className="page-sub">Upload a photo or fill in the details manually.</p>

      <div className="card p-6 sm:p-8">
        <AddClothingForm onSuccess={() => navigate("/wardrobe")} />
      </div>
    </div>
  )
}
