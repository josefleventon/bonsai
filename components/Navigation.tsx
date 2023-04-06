import Link from 'next/link'
import Wallet from './Wallet'

export default function Navigation() {
  return (
    <nav className="absolute top-0 flex flex-row items-center justify-between w-screen px-4">
      <Link href="/">
        <p className="pl-2 text-xl font-semibold text-white">Bonsai Flowers</p>
      </Link>
      <Wallet />
    </nav>
  )
}
