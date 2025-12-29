import Link from 'next/link'

export default function Logo({ small }) {
  const size = small ? 20 : 40;
  return (
    <Link href="/" style={{display:'flex',alignItems:'center',gap:10,textDecoration:'none'}}>
      <img src="/logo/bot-2.png" alt="bottopdf logo" width={size} height={size} style={{display:'block',borderRadius:8}} />
      <span style={{fontWeight:700,color:'#0f172a',fontSize: small ? 14 : 18}}>bottopdf<span style={{color:'#06b6d4',marginLeft:6,fontWeight:800}}> .com</span></span>
    </Link>
  )
}
