export enum IStyle {
  Charcoal = "Charcoal",
  OilPainting = "Oil Painting",
  Watercolor = "Watercolor",
  Pointillism = "Pointillism",
  Acrylic = "Acrylic",
}

export const styleMap: Map<string, string> = new Map([
  [
    IStyle.Acrylic,
    "A drawing medium with versatility and vibrant colors, textured, bold, expressive brushwork and detailed realism or abstract compositions. ",
  ],
  [
    IStyle.Charcoal,
    "A drawing medium made from charred wood, known for its rich, dark tones and expressive mark-making",
  ],
  [
    IStyle.OilPainting,
    "A drawing medium with rich, luminous colors, textured impasto or smooth glossy surfaces, highly realistic. Oil based colors. Depth, vibrant color saturation.",
  ],
  [
    IStyle.Pointillism,
    "Pointillism features vibrant images created by applying small, distinct dots of color closely together. The overall effect is a shimmering, luminous quality with subtle color transitions. Edges in pointillism are often soft and diffuse, contributing to a harmonious, mosaic-like appearance.",
  ],
  [
    IStyle.Watercolor,
    "Delicate and translucent layers of color on paper, fluidity and the ability to produce soft, flowing washes, as well as intricate, detailed work through controlled brushstrokes. luminous, airy quality due to the light reflecting off the white surface of the paper through the transparent layers of paint.",
  ],
]);
