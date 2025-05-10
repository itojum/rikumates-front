"use client"

import { useEffect, useState } from "react"
import { Button, DropdownMenuButton, Header } from "smarthr-ui"
import Image, { StaticImageData } from "next/image"
import { usePathname } from "next/navigation"
import styled from "styled-components"
import { useAuthContext } from "@/contexts/AuthContext"
import { useGetProfile } from "@/hooks/profiles/useGetProfile"

import logo from "@/assets/logo.png"
import notImageUser from "@/assets/not_image_user.png"
import Link from "next/link"

export const MyHeader = () => {
  const pathname = usePathname()
  const { user, signOut } = useAuthContext()
  const { profile } = useGetProfile(user?.id ?? "")

  const [avatarUrl, setAvatarUrl] = useState<StaticImageData | string>(notImageUser)
  useEffect(() => {
    if (profile?.avatar_url && user?.id) {
      setAvatarUrl(profile.avatar_url)
    }else {
      setAvatarUrl(notImageUser)
    }
  }, [profile?.avatar_url, user?.id])


  if (pathname === "/") {
    return null
  }
  return (
    <MHeader
        logo={<LogoImage src={logo} alt="logo" height={50} />}
    >
      <WhiteLink href="/companies">企業</WhiteLink>
      <WhiteLink href="/todos">タスク</WhiteLink>
      <WhiteLink href="/events">イベント</WhiteLink>
      {user && (
        <DropdownMenuButton 
          triggerSize="s"
          label={<Image src={avatarUrl} alt="avatar" width={30} height={30} />} 
      >
        <BlackLink href="/profile">{profile?.name}</BlackLink>
        <Button onClick={signOut}>ログアウト</Button>
      </DropdownMenuButton>
      )}
    </MHeader>
  )
}

const MHeader = styled(Header)`
  background-color:rgb(65, 119, 235);
`
const LogoImage = styled(Image)`
  height: 50px;
  margin: 5px 10px;
`

const WhiteLink = styled(Link)`
  color: white;
  text-decoration: none;
  margin: 0 10px;
`

const BlackLink = styled(Link)`
  color: black;
  text-decoration: none;
  margin: 0 10px;
`