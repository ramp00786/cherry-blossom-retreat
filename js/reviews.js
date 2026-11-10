/*
 * Cherry Blossom Retreat — Guest reviews (50).
 * Collected from Google Maps, MakeMyTrip and Agoda (Nov 2026).
 * To add a review: add an object to REVIEWS → { n: name, s: source, r: rating, d: "Mon YYYY", t: "text" }
 * source must be one of: "google" | "mmt" | "agoda". Rating for google/mmt is out of 5, agoda out of 10.
 */
(function () {
  const REVIEWS = [
    { n: "Sreelal Sreedharan", s: "google", r: 5, d: "Oct 2026", t: "An amazing stay – truly a home away from home! From the moment I arrived, I felt a warm and homely atmosphere. The owner and all the staff were extremely friendly, polite, helpful and supportive. The room was exceptionally clean, neat and well-maintained. What makes this place special is the genuine care, respect and warmth shown to every guest. Highly recommended! ❤️🏡" },
    { n: "George S.", s: "mmt", r: 5, d: "Oct 2026", t: "Nice stay, owner and staff are polite. Travel arrangements to nearby places will be arranged by the owner if you ask him." },
    { n: "Nowfal Shanavas", s: "google", r: 5, d: "Aug 2026", t: "Great experience! A lovely new building with fresh, super clean rooms. The maintenance and ambiance were excellent. Worth every penny!" },
    { n: "palani manic", s: "google", r: 5, d: "Oct 2026", t: "I had a wonderful stay at this place! The ambience is peaceful, welcoming, and feels just like home. The homemade food was delicious, fresh, and prepared with great care. The owner is very friendly, kind, and supportive, ensuring guests feel comfortable and well taken care of." },
    { n: "Noufal", s: "agoda", r: 9.2, d: "Aug 2026", t: "Clean & comfortable stay. The room was spacious, spotlessly clean, and well maintained. The owner were friendly and helpful throughout my stay. Wi-Fi was reliable, and the parking facility was very convenient." },
    { n: "Resmi", s: "google", r: 5, d: "Oct 2026", t: "I stayed here for 6 days, and I had a very pleasant experience. The rooms were neat and clean, the atmosphere was peaceful, and the place felt very safe and comfortable. Highly recommended!" },
    { n: "reivaz 96", s: "google", r: 5, d: "Nov 2026", t: "Perfect in all senses ☮️ Owner and staff are very helpful. Homely food and it's perfect. Very spacious courtyard and can park multiple 4-wheelers. I misplaced my exam hall ticket 🎫, but the owner was exceptionally kind and just arranged it and fixed the situation." },
    { n: "Babitha Babii", s: "google", r: 5, d: "Oct 2026", t: "We had a wonderful stay at this homestay in Kollam. The place was clean, peaceful, comfortable, and well-maintained, and very close to my exam centre, which made everything so convenient and stress-free. The host was extremely friendly, supportive, and helpful." },
    { n: "Chitranjandoss G.", s: "mmt", r: 5, d: "Aug 2026", t: "Had a great time. The rooms were clean and neat, just a bit smaller than I expected. Otherwise, everything was good." },
    { n: "Siju Raju", s: "google", r: 5, d: "Oct 2026", t: "The host is a very friendly person and made our stay very comfortable. The place is calm, quiet and gives a real homely feeling. Rooms were clean and tidy, bathroom was also very neat and clean. Very budget friendly for the quality they provide." },
    { n: "Vikas Gurjar", s: "google", r: 5, d: "Oct 2026", t: "Our stay was nothing short of exemplary. The owner's impeccable hospitality and attention to detail set a magnificent tone. The service attendant was exceptionally courteous and prompt. Insider tip: the management extends a special tariff discount for defence personnel." },
    { n: "Deepak Singh", s: "google", r: 5, d: "Aug 2026", t: "Much better than we expected. We stayed in the new building, and everything felt fresh, clean, modern, and very well maintained. The rooms were spacious and comfortable. The staff were genuinely friendly and polite." },
    { n: "Jithin Job", s: "google", r: 5, d: "Sep 2026", t: "Had a really great stay! Vinod was a very kind and welcoming host. The food was excellent too — fresh, tasty, and so homely that it honestly felt like I was eating at home. Would definitely recommend this place." },
    { n: "Vigil", s: "agoda", r: 10, d: "Jul 2026", t: "Exceptional. Good atmosphere, neat & clean rooms, good parking facility. Easy to access town." },
    { n: "Jerin jacob Sam", s: "google", r: 5, d: "Sep 2026", t: "I had a good time with family and giving this place a solid 5 out of 5 stars. I highly recommend it to anyone looking for a relaxing and authentic stay." },
    { n: "K. Sriram", s: "google", r: 5, d: "Aug 2026", t: "Pleasant stay. Very good service. 100% recommended. Rooms and bathrooms were well maintained. Bang for buck!!" },
    { n: "Jyothis Shaji", s: "google", r: 5, d: "Sep 2026", t: "A wonderful stay, away from the hustle and bustle of the busy city. We were a group of 12, and the manager was extremely helpful and cooperative. He provided great support with transportation and was always attentive." },
    { n: "Sudheesh R.", s: "mmt", r: 4, d: "Aug 2026", t: "Anyways nice stay. Have a nice day." },
    { n: "Vijin Vijayan", s: "google", r: 5, d: "Oct 2026", t: "Really good rooms and service. Only problem was conveyance. Apart from that, really satisfied." },
    { n: "fath shilz", s: "google", r: 5, d: "Aug 2026", t: "Highly recommended! The host was incredibly friendly, kind, and very helpful. The room was new, spotlessly clean, and offered great value for the price. As a solo female traveller, I felt completely safe and comfortable. ⭐⭐⭐⭐⭐" },
    { n: "IRFAN ZAKEER", s: "google", r: 5, d: "Oct 2026", t: "Nice service. Clean rooms, quiet atmosphere, and smooth, fast check-in." },
    { n: "Tarh Charkia", s: "google", r: 5, d: "Sep 2026", t: "Very good hotel, it won't disappoint any expectations for the price. The manager is also very attentive and caring." },
    { n: "Krishnendu Mukherjee", s: "google", r: 5, d: "Nov 2026", t: "Environment is peaceful, calm and quiet... property owner is very friendly and helpful." },
    { n: "Benedict Alphonse", s: "google", r: 5, d: "Sep 2026", t: "The service over there was too good. It is run in a very professional way — a small space but really good, vivid and organised." },
    { n: "Om Muthu", s: "google", r: 5, d: "Oct 2026", t: "We had great hospitality with a wonderful stay." },
    { n: "Harishankar Sivasubramanian", s: "google", r: 5, d: "Aug 2026", t: "Pleasant and calm place to stay. Budget-friendly rooms that are well-maintained." },
    { n: "Mahesh Javkar", s: "google", r: 5, d: "Sep 2026", t: "This is an excellent homestay in Kollam. Owner is also very helpful. I would recommend this stay to everyone." },
    { n: "MUHAMMED SIDDIQUE", s: "google", r: 5, d: "Oct 2026", t: "Very good service, neat and clean, affordable price." },
    { n: "Kumar Xavier", s: "google", r: 5, d: "Oct 2026", t: "Clean rooms, meticulous service, nice ambience." },
    { n: "Hodophile", s: "google", r: 5, d: "Sep 2026", t: "Nice place to stay... must visit!" },
    { n: "Akhil Anil", s: "google", r: 5, d: "Oct 2026", t: "A wonderful experience. The room was clean, comfortable, and well-maintained. The location near Apsara Junction is ideal — just 3 km from Kollam Railway Station. A special thanks to the host, Vinod, who was courteous, attentive, and helpful throughout our stay." },
    { n: "S", s: "google", r: 5, d: "Aug 2026", t: "Recommended to stay with friends and families." },
    { n: "Nikas George", s: "google", r: 5, d: "Aug 2026", t: "New building and new rooms, budget friendly ☺" },
    { n: "Shanavas Fathima SF", s: "google", r: 5, d: "Oct 2026", t: "Very very good location 💯" },
    { n: "Dileep Rathore", s: "google", r: 5, d: "Oct 2026", t: "Very nice room." },
    { n: "Anandhu Babu", s: "google", r: 5, d: "Oct 2026", t: "Good service ♥️" },
    { n: "Yasir Paramban", s: "google", r: 5, d: "Sep 2026", t: "Excellent 👌" },
    { n: "Muneer K A", s: "google", r: 5, d: "Nov 2026", t: "Highly recommended, especially for students appearing for exams! It is located very close to Sree Buddha Centre for IT, Palkulangara. The rooms are clean, well-maintained, and comfortable, with a calm and peaceful atmosphere — ideal to relax and prepare for exams." },
    { n: "Bharath .V.M", s: "google", r: 5, d: "Nov 2026", t: "We had a very pleasant stay. The rooms were neat and clean, the atmosphere was peaceful, and the service was excellent. Everything was well-organised. Would definitely love to visit again!" },
    { n: "Aneesh Kumar S", s: "google", r: 5, d: "Oct 2026", t: "Had a wonderful stay — really homelike. The owner Vinod showed great hospitality. The food is tasty and reasonably priced. Rooms are new, clean and well managed. The Wi-Fi connectivity is good for working professionals." },
    { n: "kartik A G", s: "google", r: 5, d: "Oct 2026", t: "Great stay at Cherry Blossom Retreat! 🌸 Clean and peaceful property with excellent hospitality. Friendly hosts and a relaxing atmosphere. Highly recommended! ❤️" },
    { n: "Nikhil Sopanam", s: "google", r: 5, d: "Oct 2026", t: "Neat and clean, good customer service. Homely feel, budget friendly, in a city circle 🫶" },
    { n: "Bhadra", s: "google", r: 5, d: "Oct 2026", t: "The service is very good and I like the rooms." },
    { n: "Arun P", s: "google", r: 5, d: "Oct 2026", t: "Good stay in a calm and quiet atmosphere." },
    { n: "Nangram Maji", s: "google", r: 5, d: "Sep 2026", t: "Best hospitality and the manager is so caring. Best ever." },
    { n: "albin", s: "google", r: 5, d: "Oct 2026", t: "Good experience, location is good, must visit." },
    { n: "sobin babu", s: "google", r: 5, d: "Oct 2026", t: "Very good service and very good behaviour." },
    { n: "Jai s", s: "google", r: 5, d: "Oct 2026", t: "Everything was completely perfect and good." },
    { n: "Rohith Raj", s: "google", r: 5, d: "Nov 2026", t: "We had a wonderful stay at Cherry Blossom during our recent vacation! The rooms were clean, comfortable, and well-maintained. The staff was incredibly welcoming, polite, and always ready to help. Highly recommended!" },
    { n: "Satish V", s: "google", r: 5, d: "Nov 2026", t: "A good homestay with home-cooked food. Service and accommodation are excellent. Our stay was very pleasant. The homestay is in a very quiet place." }
  ];

  const SRC = {
    google: { label: "Google", logo: "G", max: 5 },
    mmt: { label: "MakeMyTrip", logo: "my", max: 5 },
    agoda: { label: "Agoda", logo: "a", max: 10 }
  };

  const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const initials = n => n.trim().split(/\s+/).slice(0, 2).map(w => w[0]).join("").toUpperCase();
  const stars = (r, max) => {
    const five = Math.round((r / max) * 5);
    return "★★★★★".slice(0, five) + "☆☆☆☆☆".slice(0, 5 - five);
  };

  const card = rv => {
    const src = SRC[rv.s];
    const score = rv.s === "agoda" ? `${rv.r.toFixed(1)}/10` : `${rv.r}/5`;
    return `<article class="rv rv--${rv.s}">
      <header class="rv__head">
        <span class="rv__avatar" aria-hidden="true">${esc(initials(rv.n))}</span>
        <span class="rv__who"><strong>${esc(rv.n)}</strong><small>${esc(rv.d)}</small></span>
        <span class="rv__src rv__src--${rv.s}" title="${src.label}">${src.logo}</span>
      </header>
      <p class="rv__stars" aria-label="Rated ${score} on ${src.label}">${stars(rv.r, src.max)} <b>${score}</b></p>
      <p class="rv__text">${esc(rv.t)}</p>
      <p class="rv__via">via ${src.label}</p>
    </article>`;
  };

  const wall = document.getElementById("reviewWall");
  if (!wall) return;

  const countEl = document.getElementById("reviewCount");
  if (countEl) countEl.textContent = REVIEWS.length;

  // Split into columns (2 on wide screens via CSS, the 2nd column hidden on mobile so all go into col 1 there)
  const twoCols = window.matchMedia("(min-width: 1100px)").matches;
  const cols = twoCols ? [[], []] : [[]];
  REVIEWS.forEach((rv, i) => cols[i % cols.length].push(rv));

  wall.innerHTML = cols.map((list, i) => {
    const html = list.map(card).join("");
    // content duplicated once → animate translateY(0 → -50%) for a seamless bottom-to-top loop
    return `<div class="rv-col rv-col--${i + 1}" style="--dur:${list.length * (twoCols ? 7 : 5.5)}s"><div class="rv-col__track">${html}<div aria-hidden="true" class="rv-col__dup">${html}</div></div></div>`;
  }).join("");
  wall.classList.add("is-ready");

  // Pause on hover / touch-hold, resume on leave
  wall.addEventListener("touchstart", () => wall.classList.add("is-paused"), { passive: true });
  wall.addEventListener("touchend", () => wall.classList.remove("is-paused"));
})();
