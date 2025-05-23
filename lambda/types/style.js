"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.styleMap = exports.IStyle = void 0;
var IStyle;
(function (IStyle) {
    IStyle["Charcoal"] = "Charcoal";
    IStyle["OilPainting"] = "Oil Painting";
    IStyle["Watercolor"] = "Watercolor";
    IStyle["Pointillism"] = "Pointillism";
    IStyle["Acrylic"] = "Acrylic";
})(IStyle || (exports.IStyle = IStyle = {}));
exports.styleMap = new Map([
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3R5bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzdHlsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSxJQUFZLE1BTVg7QUFORCxXQUFZLE1BQU07SUFDaEIsK0JBQXFCLENBQUE7SUFDckIsc0NBQTRCLENBQUE7SUFDNUIsbUNBQXlCLENBQUE7SUFDekIscUNBQTJCLENBQUE7SUFDM0IsNkJBQW1CLENBQUE7QUFDckIsQ0FBQyxFQU5XLE1BQU0sc0JBQU4sTUFBTSxRQU1qQjtBQUVZLFFBQUEsUUFBUSxHQUF3QixJQUFJLEdBQUcsQ0FBQztJQUNuRDtRQUNFLE1BQU0sQ0FBQyxPQUFPO1FBQ2QsNElBQTRJO0tBQzdJO0lBQ0Q7UUFDRSxNQUFNLENBQUMsUUFBUTtRQUNmLG9HQUFvRztLQUNyRztJQUNEO1FBQ0UsTUFBTSxDQUFDLFdBQVc7UUFDbEIsK0pBQStKO0tBQ2hLO0lBQ0Q7UUFDRSxNQUFNLENBQUMsV0FBVztRQUNsQixvU0FBb1M7S0FDclM7SUFDRDtRQUNFLE1BQU0sQ0FBQyxVQUFVO1FBQ2pCLGtUQUFrVDtLQUNuVDtDQUNGLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBlbnVtIElTdHlsZSB7XHJcbiAgQ2hhcmNvYWwgPSBcIkNoYXJjb2FsXCIsXHJcbiAgT2lsUGFpbnRpbmcgPSBcIk9pbCBQYWludGluZ1wiLFxyXG4gIFdhdGVyY29sb3IgPSBcIldhdGVyY29sb3JcIixcclxuICBQb2ludGlsbGlzbSA9IFwiUG9pbnRpbGxpc21cIixcclxuICBBY3J5bGljID0gXCJBY3J5bGljXCIsXHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBzdHlsZU1hcDogTWFwPHN0cmluZywgc3RyaW5nPiA9IG5ldyBNYXAoW1xyXG4gIFtcclxuICAgIElTdHlsZS5BY3J5bGljLFxyXG4gICAgXCJBIGRyYXdpbmcgbWVkaXVtIHdpdGggdmVyc2F0aWxpdHkgYW5kIHZpYnJhbnQgY29sb3JzLCB0ZXh0dXJlZCwgYm9sZCwgZXhwcmVzc2l2ZSBicnVzaHdvcmsgYW5kIGRldGFpbGVkIHJlYWxpc20gb3IgYWJzdHJhY3QgY29tcG9zaXRpb25zLiBcIixcclxuICBdLFxyXG4gIFtcclxuICAgIElTdHlsZS5DaGFyY29hbCxcclxuICAgIFwiQSBkcmF3aW5nIG1lZGl1bSBtYWRlIGZyb20gY2hhcnJlZCB3b29kLCBrbm93biBmb3IgaXRzIHJpY2gsIGRhcmsgdG9uZXMgYW5kIGV4cHJlc3NpdmUgbWFyay1tYWtpbmdcIixcclxuICBdLFxyXG4gIFtcclxuICAgIElTdHlsZS5PaWxQYWludGluZyxcclxuICAgIFwiQSBkcmF3aW5nIG1lZGl1bSB3aXRoIHJpY2gsIGx1bWlub3VzIGNvbG9ycywgdGV4dHVyZWQgaW1wYXN0byBvciBzbW9vdGggZ2xvc3N5IHN1cmZhY2VzLCBoaWdobHkgcmVhbGlzdGljLiBPaWwgYmFzZWQgY29sb3JzLiBEZXB0aCwgdmlicmFudCBjb2xvciBzYXR1cmF0aW9uLlwiLFxyXG4gIF0sXHJcbiAgW1xyXG4gICAgSVN0eWxlLlBvaW50aWxsaXNtLFxyXG4gICAgXCJQb2ludGlsbGlzbSBmZWF0dXJlcyB2aWJyYW50IGltYWdlcyBjcmVhdGVkIGJ5IGFwcGx5aW5nIHNtYWxsLCBkaXN0aW5jdCBkb3RzIG9mIGNvbG9yIGNsb3NlbHkgdG9nZXRoZXIuIFRoZSBvdmVyYWxsIGVmZmVjdCBpcyBhIHNoaW1tZXJpbmcsIGx1bWlub3VzIHF1YWxpdHkgd2l0aCBzdWJ0bGUgY29sb3IgdHJhbnNpdGlvbnMuIEVkZ2VzIGluIHBvaW50aWxsaXNtIGFyZSBvZnRlbiBzb2Z0IGFuZCBkaWZmdXNlLCBjb250cmlidXRpbmcgdG8gYSBoYXJtb25pb3VzLCBtb3NhaWMtbGlrZSBhcHBlYXJhbmNlLlwiLFxyXG4gIF0sXHJcbiAgW1xyXG4gICAgSVN0eWxlLldhdGVyY29sb3IsXHJcbiAgICBcIkRlbGljYXRlIGFuZCB0cmFuc2x1Y2VudCBsYXllcnMgb2YgY29sb3Igb24gcGFwZXIsIGZsdWlkaXR5IGFuZCB0aGUgYWJpbGl0eSB0byBwcm9kdWNlIHNvZnQsIGZsb3dpbmcgd2FzaGVzLCBhcyB3ZWxsIGFzIGludHJpY2F0ZSwgZGV0YWlsZWQgd29yayB0aHJvdWdoIGNvbnRyb2xsZWQgYnJ1c2hzdHJva2VzLiBsdW1pbm91cywgYWlyeSBxdWFsaXR5IGR1ZSB0byB0aGUgbGlnaHQgcmVmbGVjdGluZyBvZmYgdGhlIHdoaXRlIHN1cmZhY2Ugb2YgdGhlIHBhcGVyIHRocm91Z2ggdGhlIHRyYW5zcGFyZW50IGxheWVycyBvZiBwYWludC5cIixcclxuICBdLFxyXG5dKTtcclxuIl19