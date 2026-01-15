// import Link from "next/link";

// export default function Navbar() {
//   return (
//     <nav>
//       <Link href="/dashboard">Dashboard</Link> |{" "}
//       <Link href="/team">Team</Link> |{" "}
//       <Link href="/submit">Submit</Link> |{" "}
//       <Link href="/leaderboard/live">Live</Link> |{" "}
//       <Link href="/leaderboard/final">Final</Link>
//     </nav>
//   );
// }


// "use client";

// import Link from "next/link";

// export default function Navbar() {
//   return (
//     <nav className="navbar">
//       <div className="nav-inner">
//         <div className="nav-links">
//           <Link href="/dashboard">Dashboard</Link>
//           <Link href="/team">Team</Link>
//           <Link href="/submit">Submit</Link>
//           <Link href="/live">Live</Link>
//           <Link href="/final">Final</Link>
//         </div>
//       </div>

//       <style jsx>{`
//         .navbar {
//           background: #0b0b0b;
//           border-bottom: 1px solid #1f1f1f;
//         }

//         .nav-inner {
//           max-width: 1200px;
//           margin: 0 auto;
//           padding: 14px 24px;
//           display: flex;
//           align-items: center;
//           justify-content: flex-start; /* keeps everything LEFT */
//         }

//         .nav-links {
//           display: flex;
//           gap: 28px; /* THIS controls spacing */
//         }

//         .nav-links a {
//           font-size: 0.95rem;
//           color: #e5e5e5;
//           text-decoration: none;
//         }

//         .nav-links a:hover {
//           color: #ffffff;
//         }
//       `}</style>
//     </nav>
//   );
// }


"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full border-b border-neutral-800 bg-black">
      <div className="mx-auto flex h-14 max-w-7xl items-center px-6">
        <div className="flex gap-8">
          <Link href="/dashboard" className="nav-link">
            Dashboard
          </Link>
          <Link href="/team" className="nav-link">
            Team
          </Link>
          <Link href="/submit" className="nav-link">
            Submit
          </Link>
          <Link href="/live" className="nav-link">
            Live
          </Link>
          <Link href="/final" className="nav-link">
            Final
          </Link>
        </div>
      </div>
    </nav>
  );
}
