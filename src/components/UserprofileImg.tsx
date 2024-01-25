"use client";
// import React, { useEffect } from "react";
// import Image from "next/image";
// import { useSession } from "next-auth/react";

// function UserProfileImg() {
//   const { data: session, status } = useSession();

//   if (session?.user) {
//     return (
//       <>
//         {session?.user && (
//           <div className="relative w-8 h-8 rounded-md">
//             <Image
//               src={session.user.image}
//               alt=""
//               fill
//               sizes="100%"
//               className="object-contain"
//             />
//           </div>
//         )}
//       </>
//     );
//   }
// }

// export default UserProfileImg;

// Import necessary modules and components
import React, { useEffect } from "react";
import Image from "next/image";

import { useSession } from "next-auth/react";

function UserProfileImg() {
  // Get session data
  const { data: session, status } = useSession();
  // Check if there is a user session
  if (session?.user) {
    return (
      <div className="relative w-8 h-8 cursor-pointer">
        {session.user.image ? (
          // Render the Image component with the user's image
          <Image
            src={session.user.image}
            alt=""
            fill
            sizes="100%"
            className="object-contain rounded-full"
          />
        ) : (
          // Render a fallback content if the user's image is not available
          <div className="relative w-8 h-8 md:w-5 md:h-5 rounded-full">
            <Image
              src="/noAvatar.png "
              alt=""
              fill
              sizes="100%"
              className="object-contain"
            />
          </div>
        )}
      </div>
    );
  }

  // If there is no user session, render nothing or a fallback content
  return null;
}

export default UserProfileImg;
