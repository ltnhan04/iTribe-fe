export const formatTitle = (slug: string) => {
  const words = slug.split("-");

  const formattedTitle = words.map((word, index) => {
    if (index === 0) {
      const firstLetter = word.charAt(0);
      const restLetter = word.substring(1);
      const upperCase =
        restLetter.charAt(0).toUpperCase() + restLetter.slice(1);
      return firstLetter.concat(upperCase);
    }
    return word;
  });
  return formattedTitle.join(" ");
};
