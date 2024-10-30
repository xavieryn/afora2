import Link from 'next/link'
import React from 'react'
import { Mail } from 'lucide-react'

function ContactUs() {
  return (
    <Link href={'/contact'}> <Mail/></Link>
  )
}

export default ContactUs