"use client"

import { Header } from "smarthr-ui"
import logo from "@/assets/logo.png"
import Image from "next/image"
import { usePathname } from "next/navigation"
import styled from "styled-components"

export const MyHeader = () => {
  const pathname = usePathname()
  if (pathname === "/") {
    return null
  }

  return (
    <MHeader
        logo={<LogoImage src={logo} alt="logo" height={50} />}
    />
  )
}

const MHeader = styled(Header)`
  background-color:rgb(65, 119, 235);
`
const LogoImage = styled(Image)`
  height: 50px;
  margin: 5px 10px;
`