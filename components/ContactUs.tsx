import Link from 'next/link'
import React from 'react'
import { Mail } from 'lucide-react'

function ContactUs() {
  return (
    <Link href={'/contact'}> <Mail className='text-white hover:translate-y-[-2px] transition-transform duration-300'/></Link>
  )
}

export default ContactUs