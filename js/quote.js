document.addEventListener("DOMContentLoaded", () => {
  const quotes = [
    { text: "The body achieves what the mind believes.", author: "Unknown" },
    { text: "Train insane or remain the same.", author: "Jillian Michaels" },
    {
      text: "Push yourself because no one else is going to do it for you.",
      author: "Unknown",
    },
    {
      text: "You don’t have to be extreme, just consistent.",
      author: "Unknown",
    },
    { text: "No pain, no gain. Shut up and train.", author: "Unknown" },
    { text: "Sweat is fat crying.", author: "Unknown" },
    { text: "Fall in love with taking care of yourself.", author: "Unknown" },
    {
      text: "Your body can stand almost anything. It’s your mind that you have to convince.",
      author: "Unknown",
    },
    { text: "Wake up. Work out. Look hot. Kick ass.", author: "Unknown" },
    { text: "Good things come to those who sweat.", author: "Unknown" },
    {
      text: "Don’t limit your challenges. Challenge your limits.",
      author: "Jerry Dunn",
    },
    { text: "It never gets easier. You just get stronger.", author: "Unknown" },
    {
      text: "If it doesn’t challenge you, it doesn’t change you.",
      author: "Fred DeVito",
    },
    { text: "Strive for progress, not perfection.", author: "Unknown" },
    {
      text: "Discipline is choosing between what you want now and what you want most.",
      author: "Abraham Lincoln",
    },
    {
      text: "You’re only one workout away from a good mood.",
      author: "Unknown",
    },
    {
      text: "A one hour workout is 4% of your day. No excuses.",
      author: "Unknown",
    },
    { text: "Sore today, strong tomorrow.", author: "Unknown" },
    {
      text: "Work hard in silence. Let success be your noise.",
      author: "Frank Ocean",
    },
    {
      text: "You miss 100% of the shots you don’t take.",
      author: "Wayne Gretzky",
    },
    {
      text: "When you feel like quitting, think about why you started.",
      author: "Unknown",
    },
    { text: "Excuses don’t burn calories.", author: "Unknown" },
    {
      text: "The hard part isn’t getting your body in shape. The hard part is getting your mind in shape.",
      author: "Unknown",
    },
    {
      text: "A little progress each day adds up to big results.",
      author: "Unknown",
    },
    { text: "Success starts with self-discipline.", author: "Unknown" },
    { text: "Strong is the new sexy.", author: "Unknown" },
    {
      text: "Don’t stop when you’re tired. Stop when you’re done.",
      author: "Unknown",
    },
    { text: "Progress, not perfection.", author: "Kim Collins" },
    {
      text: "Fitness is like a relationship. You can’t cheat and expect it to work.",
      author: "Unknown",
    },
    { text: "You are your only limit.", author: "Unknown" },
  ];

  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  document.querySelector(
    ".quote"
  ).textContent = `“${quote.text}” — ${quote.author}`;
});
