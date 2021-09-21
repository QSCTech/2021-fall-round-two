window.onload = () => {
  const data = [
    {
      sentence: "一个细胞里，却分裂出了两种截然不同的命运。",
      from: "秦明「法医秦明」",
    },
    {
      sentence: "人间忽晚，山河已秋。",
      from: "亦沫不吃鱼「人间忽晚」",
    },
    {
      sentence: "失去故土的花朵，回不去，却也离不开。",
      from: "夏达「长歌行」",
    },
  ];
  data.forEach((value) => {
    const divElement = document.createElement("div");
    const sentence = document.createElement("p");
    const author = document.createElement("span");

    divElement.className = "card";
    sentence.innerText = value.sentence;
    author.innerText = `——${value.from}`;

    divElement.appendChild(sentence);
    divElement.appendChild(author);
    document.getElementById("app").appendChild(divElement);
  });
};
