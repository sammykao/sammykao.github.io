import SpotifyTracks from 'app/components/SpotifyTracks';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        Sammy Kao
      </h1>
      <p className="mb-4">
        Welcome to my personal website! I'm a student at Tufts University studying Computer Science and Finance.
        Within my computer science degree, I'm focusing on a concentration in Artificial Intelligence. 

      </p>
      <p className="mb-4">
        My background includes experience in so many different technology internships and startup projects. From running multiple
        of my own startups, to working for Tufts University, to working at 1k+ employee 
        companies, I've learned so much. I'm always looking for new opportunities to learn and grow. I love AI. 
        I love indie hacking. I love startups. I love finance. I love to code. Most importantly, I love to learn.
      </p>
      <p className="mb-4">
        When I'm not meticulously engineering software, or reading Finance/Tech newsletters, you can probably hyper fixating
        on how to optimize my busy schedule. Let me actually circle back to the newsletters thing. I love reading them. Shoutout 
        to ByteByteGo systems design, TLDR AI & Founders, Deepview.co, Pitchbook Daily, BigDeskEnergy, and more.
      </p>
      <p className="mb-4">
        I'm also a collegiate athlete. I play Varisty Men's Soccer for Tufts University. I'm a goalkeeper, so I'm used to
        getting hurt. It's actually perfect training for bashing your head against a wall when the product bugs don't go away
        and the Kanban board doesn't move. I've torn my meniscus 3 times, my ACL once, my rotator cuff once, broken my elbow
        in 3 different places, and broke my wrist once. But it's ok, who needs of all that stuff anyways?
      </p>
      <p className="mb-4">
        In my limited free time, I love to cook, exercise, and curate my Pinterest feed. I'm a huge foodie. Let's go head to head
        on Beli or Resy. My most memorable places recently have been Dishoom in London, and Palacios de Los Patos in Granada.
      </p>
      
      {/* Profile image section */}
      <div className="my-8 flex justify-center">
        <Image
          src="/Profile_Pic.jpg"
          alt="Profile picture"
          width={300}
          height={300}
          className="rounded-full w-48 h-48 md:w-64 md:h-64 object-cover"
        />
      </div>
      {/* Placeholder blurb below image */}
      <p className="mb-8 text-neutral-700 dark:text-neutral-300">
        {/* Add a brief personal blurb here about your journey, passions, or this photo */}
        Yes. The only photo I'm including on my website is a photo of me with George Kittle, the SF 49ers tight end. 
        This hurts. Especially as an Eagles fan. Crazy story actually - this was at Tomorrowland Winter in March 2025.
        We flew in to Lyon from Madrid and decided to live in an RV for the week in the French Alps. Imagine hacking up some 
        Typescript React connected to your phone hotspot while you're food cooks on gas canisters. On the way up a mountain,
        my RV ran out of gas. I spent 3 hours calling every French tow truck company in a 1hr radius, even the French police. 
        I finally found an Uber driver who was able to go up the mountain to the closest gas station and funnel gas back and forth.
        We didn't have a canister so we used make shift water bottles, and I was able to get the RV going again after 4 trips up 
        and down the mountain. <br></br><br></br>
        That day I skied my first black diamond. I was at the daytime Lost Frequencies set, at the porta potties with my friend, 
        and bam! He was there. George was incredibly humble and down to earth. Very friendly. But of course, I had to tell him obnoxiously
        how much I love the Eagles.
      </p>
      <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800">
        <h2 className="text-xl font-semibold tracking-tighter mb-6">
          My Music Taste
        </h2>
        <p className="mb-4 text-neutral-700 dark:text-neutral-300">
          Here are the last 20 songs I've listened to on Spotify. My music taste reflects my personality: eclectic, always evolving, and occasionally surprising.
        </p>
        <SpotifyTracks />
      </div>
    </section>
  )
} 