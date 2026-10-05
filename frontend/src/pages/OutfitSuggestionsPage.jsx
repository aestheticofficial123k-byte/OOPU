import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

import {
  getSuggestions,
  getOccasionSuggestions,
  getCommunityOutfits,
  getMyOutfits,
  toggleLike,
  toggleSave,
  deleteOutfit,
} from "../api/outfitApi"

import OutfitCard from "../components/outfit/OutfitCard"
import Spinner from "../components/ui/Spinner"
import Alert from "../components/ui/Alert"
import EmptyState from "../components/ui/EmptyState"

const OCCASIONS = [
  "casual",
  "semi-formal",
  "formal",
]

const TABS = [
  { id: "for-you", label: "For You", icon: "✦" },
  { id: "suggestions", label: "Suggestions", icon: "✨" },
  { id: "trending", label: "Trending", icon: "🔥" },
  { id: "following", label: "Following", icon: "♧" },
  { id: "challenges", label: "Challenges", icon: "🏆" },
  { id: "mine", label: "My Outfits", icon: "♧" },
]

const PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23e8e0d0' width='400' height='400'/%3E%3Ctext fill='%23c4a882' font-size='80' x='50%25' y='55%25' text-anchor='middle'%3E?%3C/text%3E%3C/svg%3E"


// ─────────────────────────────────────────────────────────────────────────────
// Icons
// ─────────────────────────────────────────────────────────────────────────────

function HeartIcon({ filled = false }) {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.8 8.6c0 5.4-8.8 10.4-8.8 10.4S3.2 14 3.2 8.6C3.2 5.6 5.3 4 7.8 4c1.6 0 3.1.8 4.2 2.1C13.1 4.8 14.6 4 16.2 4c2.5 0 4.6 1.6 4.6 4.6Z" />
    </svg>
  )
}

function CommentIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 11.5a7.5 7.5 0 0 1-7.5 7.5H8l-4 2 1.2-4A7.5 7.5 0 1 1 20 11.5Z" />
    </svg>
  )
}

function BookmarkIcon({ filled = false }) {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-3.5L6 21V4.5Z" />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg
      width="21"
      height="21"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m21 3-7.5 18-3.5-7-7-3.5L21 3Z" />
      <path d="M10 14 21 3" />
    </svg>
  )
}


// ─────────────────────────────────────────────────────────────────────────────
// Outfit Visual
// ─────────────────────────────────────────────────────────────────────────────

function OutfitVisual({ outfit }) {
  const images = (outfit.items || [])
    .map((item) => item?.imageUrl)
    .filter(Boolean)
    .slice(0, 4)

  // No clothing images
  if (!images.length) {
    return (
      <div className="w-full h-full bg-white flex items-center justify-center">
        {outfit.imageUrl ? (
          <img
            src={outfit.imageUrl}
            alt={outfit.title || "Outfit"}
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={PLACEHOLDER}
            alt="Outfit"
            className="w-full h-full object-cover"
          />
        )}
      </div>
    )
  }

  // 1 item
  if (images.length === 1) {
    return (
      <div className="
        w-full
        h-full
        bg-white
        flex
        items-center
        justify-center
        p-5
        sm:p-8
      ">
        <img
          src={images[0]}
          alt=""
          className="
            w-full
            h-full
            object-contain
            transition-transform
            duration-500
            hover:scale-[1.025]
          "
        />
      </div>
    )
  }

  // 2 items
  if (images.length === 2) {
    return (
      <div className="
        w-full
        h-full
        grid
        grid-cols-2
        gap-2
        bg-white
        p-2
      ">
        {images.map((image, index) => (
          <div
            key={index}
            className="
              min-h-0
              rounded-xl
              overflow-hidden
              bg-white
              flex
              items-center
              justify-center
            "
          >
            <img
              src={image}
              alt=""
              className="
                w-full
                h-full
                object-contain
                transition-transform
                duration-500
                hover:scale-[1.03]
              "
            />
          </div>
        ))}
      </div>
    )
  }

  // 3 items
  if (images.length === 3) {
    return (
      <div className="
        w-full
        h-full
        grid
        grid-cols-2
        grid-rows-2
        gap-2
        bg-white
        p-2
      ">
        <div className="
          row-span-2
          min-h-0
          rounded-xl
          overflow-hidden
          bg-white
          flex
          items-center
          justify-center
        ">
          <img
            src={images[0]}
            alt=""
            className="
              w-full
              h-full
              object-contain
              transition-transform
              duration-500
              hover:scale-[1.03]
            "
          />
        </div>

        {images.slice(1, 3).map((image, index) => (
          <div
            key={index}
            className="
              min-h-0
              rounded-xl
              overflow-hidden
              bg-white
              flex
              items-center
              justify-center
            "
          >
            <img
              src={image}
              alt=""
              className="
                w-full
                h-full
                object-contain
                transition-transform
                duration-500
                hover:scale-[1.03]
              "
            />
          </div>
        ))}
      </div>
    )
  }

  // 4 items
  return (
    <div className="
      w-full
      h-full
      grid
      grid-cols-2
      grid-rows-2
      gap-2
      bg-white
      p-2
    ">
      <div className="
        row-span-2
        min-h-0
        rounded-xl
        overflow-hidden
        bg-white
        flex
        items-center
        justify-center
      ">
        <img
          src={images[0]}
          alt=""
          className="
            w-full
            h-full
            object-contain
            transition-transform
            duration-500
            hover:scale-[1.03]
          "
        />
      </div>

      {images.slice(1, 4).map((image, index) => (
        <div
          key={index}
          className="
            min-h-0
            rounded-xl
            overflow-hidden
            bg-white
            flex
            items-center
            justify-center
          "
        >
          <img
            src={image}
            alt=""
            className="
              w-full
              h-full
              object-contain
              transition-transform
              duration-500
              hover:scale-[1.03]
            "
          />
        </div>
      ))}
    </div>
  )
}


// ─────────────────────────────────────────────────────────────────────────────
// Community Card
// ─────────────────────────────────────────────────────────────────────────────

function CommunityCard({
  outfit,
  onLike,
  onSave,
  onDelete,
  isOwner = false,
}) {
  const user = outfit.user

  const liked = outfit.likes?.length > 0
  const saved = outfit.saves?.length > 0

  const [menuOpen, setMenuOpen] = useState(false)

  const initials = (user?.name || "U")
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/outfits?outfit=${outfit._id}`

    try {
      if (navigator.share) {
        await navigator.share({
          title: outfit.title || "OOPU Outfit",
          text: `Check out this outfit on OOPU.`,
          url: shareUrl,
        })
      } else {
        await navigator.clipboard.writeText(shareUrl)
      }
    } catch {
      // User cancelled the share dialog.
    }

    setMenuOpen(false)
  }

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this outfit?"
    )

    if (!confirmed) return

    await onDelete(outfit._id)
    setMenuOpen(false)
  }

  return (
    <article
      className="
        group
        bg-white
        rounded-[28px]
        overflow-hidden
        border
        border-stone-100
        shadow-[0_4px_20px_rgba(23,21,19,0.04)]
        hover:shadow-[0_12px_35px_rgba(23,21,19,0.08)]
        transition-all
        duration-300
      "
    >
      {/* User header */}
      <div
        className="
          flex
          items-center
          justify-between
          px-5
          pt-5
          pb-4
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
            min-w-0
          "
        >
          <div
            className="
              w-10
              h-10
              shrink-0
              rounded-full
              flex
              items-center
              justify-center
              text-sm
              font-semibold
              border-2
              border-white
              shadow-sm
            "
            style={{
              backgroundColor:
                user?.avatarColor || "#CDEDEA",
            }}
          >
            {initials}
          </div>

          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">
              {user?.name || "OOPU User"}
            </p>

            <p
              className="
                text-xs
                text-stone-400
                truncate
                mt-0.5
              "
            >
              @{user?.username || "oopu_user"}
            </p>
          </div>
        </div>

        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="More options"
            className="
              w-9
              h-9
              rounded-full
              flex
              items-center
              justify-center
              text-stone-400
              hover:bg-stone-100
              hover:text-[#171513]
              transition
            "
          >
            <span className="text-xl leading-none tracking-[0.08em]">
              ···
            </span>
          </button>

          {menuOpen && (
            <div
              className="
                absolute
                right-0
                top-11
                z-20
                w-44
                rounded-2xl
                border
                border-stone-100
                bg-white
                p-1.5
                shadow-[0_12px_30px_rgba(23,21,19,0.12)]
              "
            >
              {isOwner && (
                <Link
                  to={`/edit-outfit/${outfit._id}`}
                  onClick={() => setMenuOpen(false)}
                  className="
                    block
                    rounded-xl
                    px-3
                    py-2.5
                    text-sm
                    text-stone-700
                    hover:bg-[#FFF4E3]
                  "
                >
                  Edit outfit
                </Link>
              )}

              <button
                type="button"
                onClick={handleShare}
                className="
                  w-full
                  text-left
                  rounded-xl
                  px-3
                  py-2.5
                  text-sm
                  text-stone-700
                  hover:bg-[#FFF4E3]
                "
              >
                Share outfit
              </button>

              {!isOwner && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      onSave(outfit._id)
                      setMenuOpen(false)
                    }}
                    className="
                      w-full
                      text-left
                      rounded-xl
                      px-3
                      py-2.5
                      text-sm
                      text-stone-700
                      hover:bg-[#FFF4E3]
                    "
                  >
                    {saved ? "Unsave outfit" : "Save outfit"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setMenuOpen(false)}
                    className="
                      w-full
                      text-left
                      rounded-xl
                      px-3
                      py-2.5
                      text-sm
                      text-stone-700
                      hover:bg-[#FFF4E3]
                    "
                  >
                    Not interested
                  </button>
                </>
              )}

              {isOwner && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="
                    w-full
                    text-left
                    rounded-xl
                    px-3
                    py-2.5
                    text-sm
                    text-[#D95F4A]
                    hover:bg-[#FFE7E1]
                  "
                >
                  Delete outfit
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Outfit */}
      <div
        className="
          aspect-[4/4.6]
          bg-white
          overflow-hidden
        "
      >
        <OutfitVisual outfit={outfit} />
      </div>

      {/* Content */}
      <div
        className="
          px-5
          pt-4
          pb-5
        "
      >
        {outfit.title && (
          <h3
            className="
              font-display
              text-[22px]
              leading-tight
              tracking-[-0.02em]
            "
          >
            {outfit.title}
          </h3>
        )}

        {outfit.tags?.length > 0 && (
          <div
            className="
              flex
              flex-wrap
              gap-1.5
              mt-3
            "
          >
            {outfit.tags
              .slice(0, 4)
              .map((tag) => (
                <span
                  key={tag}
                  className="
                    text-[10px]
                    uppercase
                    tracking-[0.08em]
                    font-medium
                    bg-[#FFF4E3]
                    px-3
                    py-1.5
                    rounded-full
                    text-stone-500
                  "
                >
                  #{tag.replace(/^#/, "")}
                </span>
              ))}
          </div>
        )}

        <div
          className="
            h-px
            bg-stone-100
            mt-4
            mb-3
          "
        />

        {/* Social actions */}
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => onLike(outfit._id)}
            aria-label={liked ? "Unlike outfit" : "Like outfit"}
            className={`
              flex
              items-center
              gap-1.5
              text-sm
              font-medium
              transition-all
              ${
                liked
                  ? "text-[#FF8066]"
                  : "text-stone-500 hover:text-[#FF8066]"
              }
            `}
          >
            <HeartIcon filled={liked} />
            <span>{outfit.likes?.length || 0}</span>
          </button>

          <button
            type="button"
            aria-label="Comments"
            className="
              flex
              items-center
              gap-1.5
              text-sm
              font-medium
              text-stone-500
              hover:text-[#171513]
              transition
            "
          >
            <CommentIcon />
            <span>{outfit.comments?.length || 0}</span>
          </button>

          <button
            type="button"
            onClick={() => onSave(outfit._id)}
            aria-label={saved ? "Unsave outfit" : "Save outfit"}
            className={`
              flex
              items-center
              gap-1.5
              text-sm
              font-medium
              transition
              ${
                saved
                  ? "text-[#20B2AA]"
                  : "text-stone-500 hover:text-[#171513]"
              }
            `}
          >
            <BookmarkIcon filled={saved} />
            <span>{saved ? "Saved" : "Save"}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            aria-label="Share outfit"
            className="
              ml-auto
              w-9
              h-9
              rounded-full
              flex
              items-center
              justify-center
              text-stone-400
              hover:bg-stone-100
              hover:text-[#171513]
              transition
            "
          >
            <ShareIcon />
          </button>
        </div>
      </div>
    </article>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Sidebar Cards
// ─────────────────────────────────────────────────────────────────────────────

function SidebarSuggestions() {
  return (
    <section className="
      bg-[#DFF5F2]
      rounded-[24px]
      p-5
    ">

      <div className="
        flex
        items-center
        justify-between
        mb-4
      ">
        <h3 className="font-display text-xl">
          Your Outfit Suggestions ✨
        </h3>
      </div>

      <div className="
        grid
        grid-cols-3
        gap-2
      ">
        {["👕", "👖", "👟"].map(
          (item, index) => (
            <div
              key={index}
              className="
                aspect-square
                bg-white
                rounded-xl
                flex
                items-center
                justify-center
                text-3xl
              "
            >
              {item}
            </div>
          )
        )}
      </div>

      <div className="
        flex
        items-center
        justify-between
        mt-4
      ">

        <p className="text-xs text-stone-500">
          Based on your wardrobe
        </p>

        <Link
          to="/outfits"
          className="
            w-9
            h-9
            rounded-full
            bg-[#171513]
            text-white
            flex
            items-center
            justify-center
          "
        >
          →
        </Link>

      </div>
    </section>
  )
}


function SidebarChallenge() {
  return (
    <section className="
      bg-[#FFE7E1]
      rounded-[24px]
      p-5
    ">

      <p className="
        text-xs
        font-semibold
        text-stone-500
        mb-2
      ">
        🏆 Style Challenge
      </p>

      <h3 className="font-display text-2xl">
        Monochrome Week
      </h3>

      <p className="
        text-sm
        text-stone-500
        mt-2
      ">
        Share your best single-colour outfit.
      </p>

      <button
        type="button"
        className="
          mt-4
          bg-[#FFB6A8]
          rounded-full
          px-4
          py-2.5
          text-sm
          font-semibold
        "
      >
        Join Challenge →
      </button>

    </section>
  )
}


function SidebarTrending() {
  const tags = [
    "#Minimal",
    "#Streetwear",
    "#OldMoney",
    "#Techwear",
    "#CollegeFits",
    "#Monochrome",
    "#Summer",
    "#Layering",
  ]

  return (
    <section className="
      bg-white
      rounded-[24px]
      p-5
      border
      border-stone-100
    ">

      <div className="
        flex
        items-center
        justify-between
        mb-4
      ">

        <h3 className="font-display text-xl">
          🔥 Trending Styles
        </h3>

        <button
          type="button"
          className="text-xs text-stone-400"
        >
          See all
        </button>

      </div>

      <div className="
        flex
        flex-wrap
        gap-2
      ">

        {tags.map((tag) => (
          <button
            key={tag}
            type="button"
            className="
              bg-[#F5F1EB]
              rounded-full
              px-3
              py-2
              text-xs
              text-stone-600
              hover:bg-stone-200
              transition
            "
          >
            {tag}
          </button>
        ))}

      </div>
    </section>
  )
}


function SidebarPeople() {
  const people = [
    {
      name: "Ryan",
      username: "ryanfits",
    },
    {
      name: "Tanya",
      username: "tanyastyles",
    },
    {
      name: "Dev",
      username: "fitswithdev",
    },
  ]

  return (
    <section className="
      bg-white
      rounded-[24px]
      p-5
      border
      border-stone-100
    ">

      <div className="
        flex
        items-center
        justify-between
        mb-4
      ">

        <h3 className="font-display text-xl">
          Suggested People
        </h3>

        <button
          type="button"
          className="text-xs text-stone-400"
        >
          See all
        </button>

      </div>

      <div className="space-y-4">

        {people.map((person) => (

          <div
            key={person.username}
            className="
              flex
              items-center
              gap-3
            "
          >

            <div className="
              w-9
              h-9
              rounded-full
              bg-[#EEE7FF]
              flex
              items-center
              justify-center
              text-sm
              font-semibold
            ">
              {person.name[0]}
            </div>

            <div className="
              min-w-0
              flex-1
            ">

              <p className="text-sm font-semibold">
                {person.name}
              </p>

              <p className="text-xs text-stone-400">
                @{person.username}
              </p>

            </div>

            <button
              type="button"
              className="
                border
                border-stone-200
                rounded-full
                px-3
                py-1.5
                text-xs
                font-semibold
              "
            >
              Follow
            </button>

          </div>

        ))}

      </div>
    </section>
  )
}


// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────

export default function OutfitSuggestionsPage() {

  const { user } = useAuth()

  const [activeTab, setActiveTab] =
    useState("for-you")

  const [community, setCommunity] =
    useState([])

  const [myOutfits, setMyOutfits] =
    useState([])

  const [suggestions, setSuggestions] =
    useState([])

  const [activeOcc, setActiveOcc] =
    useState("general")

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState("")


  // ── API ────────────────────────────────────────────────────────────────────

  const loadCommunity = async () => {

    setLoading(true)
    setError("")

    try {

      const { data } =
        await getCommunityOutfits()

      setCommunity(
        data.data || []
      )

    } catch (err) {

      setError(
        err.response?.data?.message ||
          "Could not load community outfits."
      )

    } finally {

      setLoading(false)

    }
  }


  const loadMyOutfits = async () => {

    setLoading(true)
    setError("")

    try {

      const { data } =
        await getMyOutfits()

      setMyOutfits(
        data.data || []
      )

    } catch (err) {

      setError(
        err.response?.data?.message ||
          "Could not load your outfits."
      )

    } finally {

      setLoading(false)

    }
  }


  const fetchSuggestions = async (
    occasion
  ) => {

    setLoading(true)
    setError("")
    setActiveOcc(occasion)

    try {

      const { data } =
        occasion === "general"
          ? await getSuggestions()
          : await getOccasionSuggestions(
              occasion
            )

      setSuggestions(
        data.data || []
      )

    } catch (err) {

      setError(
        err.response?.data?.message ||
          "Could not load suggestions."
      )

      setSuggestions([])

    } finally {

      setLoading(false)

    }
  }


  useEffect(() => {
    loadCommunity()
  }, [])


  // ── Actions ────────────────────────────────────────────────────────────────

  const handleLike = async (id) => {

    try {

      const { data } =
        await toggleLike(id)

      setCommunity((current) =>
        current.map((outfit) => {

          if (outfit._id !== id) {
            return outfit
          }

          return {
            ...outfit,
            likes: Array(data.likes).fill(
              "liked"
            ),
          }

        })
      )

    } catch {

      setError(
        "Could not update like."
      )

    }
  }


  const handleSave = async (id) => {

    try {

      const { data } =
        await toggleSave(id)

      setCommunity((current) =>
        current.map((outfit) => {

          if (outfit._id !== id) {
            return outfit
          }

          return {
            ...outfit,
            saves: data.saved
              ? ["saved"]
              : [],
          }

        })
      )

    } catch {

      setError(
        "Could not update save."
      )

    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteOutfit(id)

      setMyOutfits((current) =>
        current.filter((outfit) => outfit._id !== id)
      )

      setCommunity((current) =>
        current.filter((outfit) => outfit._id !== id)
      )
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not delete outfit."
      )
    }
  }



  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="
      min-h-screen
      bg-[#FFF4E3]
      text-[#171513]
    ">

      <div className="
        mx-auto
        max-w-7xl
        px-4
        sm:px-6
        lg:px-8
        py-7
        sm:py-10
      ">

        {/* Header */}
        <div className="
          flex
          items-end
          justify-between
          gap-6
          mb-7
        ">

          <div>

            <p className="
              text-xs
              uppercase
              tracking-[0.18em]
              text-stone-400
              mb-2
            ">
              Outfits
            </p>

            <h1 className="
              font-display
              text-4xl
              sm:text-5xl
              lg:text-6xl
            ">
              Style together.
            </h1>

            <p className="
              text-stone-500
              mt-2
              text-sm
              sm:text-base
            ">
              Discover, share and get inspired.
            </p>

          </div>

          <Link
            to="/add-outfit"
            className="
              hidden
              sm:inline-flex
              bg-[#171513]
              text-white
              rounded-full
              px-5
              py-3
              text-sm
              font-semibold
              hover:scale-[1.02]
              transition
            "
          >
            + Share Outfit
          </Link>

        </div>


        {/* Mobile create */}
        <Link
          to="/add-outfit"
          className="
            sm:hidden
            flex
            items-center
            justify-center
            bg-[#171513]
            text-white
            rounded-full
            py-3.5
            text-sm
            font-semibold
            mb-6
          "
        >
          + Share Outfit
        </Link>


        {/* Tabs */}
        <div className="
          flex
          gap-2
          overflow-x-auto
          pb-2
          mb-8
          scrollbar-hide
        ">

          {TABS.map((tab) => (

            <button
              key={tab.id}
              type="button"
              onClick={() => {

                setActiveTab(tab.id)

                if (
                  tab.id === "for-you"
                ) {
                  loadCommunity()
                }

                if (
                  tab.id === "mine"
                ) {
                  loadMyOutfits()
                }

              }}
              className={`
                shrink-0
                flex
                items-center
                gap-2
                px-4
                sm:px-5
                py-2.5
                sm:py-3
                rounded-full
                text-sm
                font-medium
                transition
                ${
                  activeTab === tab.id
                    ? "bg-[#171513] text-white"
                    : "bg-white text-stone-500 hover:text-[#171513]"
                }
              `}
            >

              <span>
                {tab.icon}
              </span>

              {tab.label}

            </button>

          ))}

        </div>


        <Alert
          message={error}
          type="error"
          onClose={() => setError("")}
        />


        {/* Main layout */}
        <div className="
          grid
          lg:grid-cols-[minmax(0,1fr)_330px]
          gap-6
          items-start
        ">


          {/* Main feed */}
          <main>

            {loading ? (

              <div className="
                flex
                justify-center
                py-24
              ">
                <Spinner size="lg" />
              </div>

            ) : activeTab === "for-you" ? (

              community.length > 0 ? (

                <div className="
                  grid
                  md:grid-cols-2
                  gap-5
                ">

                  {community.map(
                    (outfit) => (

                      <CommunityCard
                        key={outfit._id}
                        outfit={outfit}
                        onLike={handleLike}
                        onSave={handleSave}
                        onDelete={handleDelete}
                        isOwner={user?._id === outfit.user?._id}
                      />

                    )
                  )}

                </div>

              ) : (

                <EmptyState
                  icon="👗"
                  title="Nothing here yet"
                  desc="Be the first to share an outfit with the OOPU community."
                />

              )

            ) : activeTab === "mine" ? (

              myOutfits.length > 0 ? (

                <div className="
                  grid
                  md:grid-cols-2
                  gap-5
                ">

                  {myOutfits.map(
                    (outfit) => (

                      <CommunityCard
                        key={outfit._id}
                        outfit={outfit}
                        onLike={handleLike}
                        onSave={handleSave}
                        onDelete={handleDelete}
                        isOwner={true}
                      />

                    )
                  )}

                </div>

              ) : (

                <EmptyState
                  icon="✨"
                  title="Create your first outfit"
                  desc="Build a look from the clothes in your wardrobe."
                />

              )

            ) : activeTab === "suggestions" ? (

              <>

                <div className="
                  flex
                  flex-wrap
                  gap-2
                  mb-7
                ">

                  {[
                    "general",
                    ...OCCASIONS,
                  ].map(
                    (occasion) => (

                      <button
                        key={occasion}
                        type="button"
                        onClick={() =>
                          fetchSuggestions(
                            occasion
                          )
                        }
                        className={`
                          px-4
                          py-2.5
                          rounded-full
                          text-sm
                          capitalize
                          ${
                            activeOcc ===
                              occasion &&
                            suggestions.length > 0
                              ? "bg-[#171513] text-white"
                              : "bg-white text-stone-500"
                          }
                        `}
                      >
                        {occasion ===
                        "general"
                          ? "✨ General"
                          : occasion}
                      </button>

                    )
                  )}

                </div>


                {suggestions.length > 0 ? (

                  <div className="
                    grid
                    sm:grid-cols-2
                    gap-5
                  ">

                    {suggestions.map(
                      (
                        suggestion,
                        index
                      ) => (

                        <OutfitCard
                          key={index}
                          outfit={
                            suggestion
                          }
                          rank={index}
                        />

                      )
                    )}

                  </div>

                ) : (

                  <EmptyState
                    icon="✨"
                    title="Get outfit suggestions"
                    desc="Choose an occasion above to generate looks from your wardrobe."
                  />

                )}

              </>

            ) : (

              <div className="
                bg-white
                rounded-[28px]
                border
                border-stone-100
                p-10
                text-center
              ">

                <div className="
                  text-4xl
                  mb-4
                ">
                  {
                    TABS.find(
                      (tab) =>
                        tab.id ===
                        activeTab
                    )?.icon
                  }
                </div>

                <h2 className="
                  font-display
                  text-2xl
                ">
                  Coming next
                </h2>

                <p className="
                  text-sm
                  text-stone-500
                  mt-2
                ">
                  We're building this part of
                  the OOPU community.
                </p>

              </div>

            )}

          </main>


          {/* Desktop sidebar */}
          <aside className="
            hidden
            lg:flex
            flex-col
            gap-5
          ">

            <SidebarSuggestions />

            <SidebarChallenge />

            <SidebarTrending />

            <SidebarPeople />

          </aside>

        </div>


        {/* Mobile sidebar */}
        <div className="
          lg:hidden
          mt-8
          space-y-5
        ">

          <SidebarSuggestions />

          <SidebarChallenge />

          <SidebarTrending />

          <SidebarPeople />

        </div>

      </div>

    </div>
  )
}