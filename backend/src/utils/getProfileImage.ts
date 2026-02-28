 export const getProfileImage = (): string => {
    const style = ["croodles", "big-ears", "notionists", "bottts", "open-peeps"];
    const random_style = Math.floor(Math.random() * style.length);
    let seed = [
      "Garfield",
      "Tinkerbell",
      "Annie",
      "Loki",
      "Cleo",
      "Angel",
      "Bob",
      "Mia",
      "Coco",
      "Gracie",
      "Bear",
      "Bella",
      "Abby",
      "Harley",
      "Cali",
      "Leo",
      "Luna",
      "Jack",
      "Felix",
      "Kiki",
    ];
    const random_seed = Math.floor(Math.random() * seed.length);
    return `https://api.dicebear.com/9.x/${style[random_style]}/svg?seed=${seed[random_seed]}`;
  };
