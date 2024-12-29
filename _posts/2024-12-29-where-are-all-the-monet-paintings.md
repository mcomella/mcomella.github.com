---
title: "Where are all the Monet Paintings?"
tags: [wikimedia,art]
license: "The data provided by Wikidata, in tables, is licensed under CC0: see <a href=\"https://www.wikidata.org/wiki/Wikidata:Copyright\">Wikidata:Copyright</a> for more information. The remainder of this work is licensed under <a rel=\"license\" href=\"http://creativecommons.org/licenses/by-sa/4.0/\">Creative Commons Attribution-ShareAlike 4.0 International License</a>.
   <br>
   <a rel=\"license\" href=\"http://creativecommons.org/licenses/by-sa/4.0/\">
     <img class=\"creative-commons\" alt=\"Creative Commons License\" src=\"https://i.creativecommons.org/l/by-sa/4.0/88x31.png\" />
   </a>"
---
I've been curious to know, which museums have the most paintings by [Claude Monet][] (or my other favorite artists)? For instance, when I travel, which museums should I go to? Which cities or countries should I include in my trip if I want to see the most art I'll enjoy? Or, if I'm already in a city/country, are there any museums I should go to based on my tastes?

When I search the web for answers, I'm dissatisfied. I find the couple of museums with the largest quantity of Monet paintings (e.g. [Musée Marmatton Monet][] and [Musée d'Orsay][]) and the best museums to go to if you're in a destination country (e.g. France or the United States) or city (e.g. Paris or New York) but it doesn't help beyond that. For example, would I be more satisfied with a trip to the [Philadelphia Museum of Art][pma] or the [Museum of Fine Arts Boston][mfa]? Are there any museums with a large collection that I haven't heard of before?

I discovered the information I need is on [Wikidata][], accessible with a [SPARQL query][sparql]. You can make queries using the [Wikidata Query Service (WQS) web interface](https://query.wikidata.org/). Use the mouse to hover over terms like `wd:Q296` to see its label and description (in this case, [`wd:Q296` is Claude Monet's identifier](https://www.wikidata.org/wiki/Q296)). Let's look at a few different queries below.

## Query #1: collections with the most paintings by Monet
This is the query I created ([link to edit/execute query directly in WQS](https://query.wikidata.org/#SELECT%20%28COUNT%28DISTINCT%20%3Fpainting%29%20AS%20%3FpaintingCount%29%20%3FcollectionLabel%20%3FcollectionCountryLabel%20WHERE%20%7B%0A%20%20%3Fpainting%20wdt%3AP170%20wd%3AQ296%3B%20%20%20%20%20%20%20%20%20%20%20%23%20creator%20%3D%20Monet%0A%20%20%20%20wdt%3AP31%20wd%3AQ3305213%3B%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%23%20instanceOf%20%3D%20painting%0A%20%20%20%20%28wdt%3AP195%2F%28wdt%3AP361%2a%29%29%20%3Fcollection.%20%23%20partOf%20a%20collection%0A%20%20OPTIONAL%20%7B%20%3Fcollection%20wdt%3AP17%20%3FcollectionCountry.%20%7D%20%23%20fetch%20the%20collection%20country%0A%20%20SERVICE%20wikibase%3Alabel%20%7B%20bd%3AserviceParam%20wikibase%3Alanguage%20%22%5BAUTO_LANGUAGE%5D%2Cmul%2Cen%22.%20%7D%0A%7D%0AGROUP%20BY%20%3Fcollection%20%3FcollectionLabel%20%3FcollectionCountryLabel%0AORDER%20BY%20DESC%20%28%3FpaintingCount%29)):
```sparql
SELECT
  (COUNT(DISTINCT ?painting) AS ?paintingCount)
  ?collectionLabel
  ?collectionCountryLabel
WHERE {
  ?painting wdt:P170 wd:Q296;           # creator = Monet
    wdt:P31 wd:Q3305213;                # instanceOf = painting
    (wdt:P195/(wdt:P361*)) ?collection. # partOf a collection
  OPTIONAL { ?collection wdt:P17 ?collectionCountry. } # get collection country
  SERVICE wikibase:label {
    bd:serviceParam wikibase:language "[AUTO_LANGUAGE],mul,en".
  }
}
GROUP BY ?collection ?collectionLabel ?collectionCountryLabel
ORDER BY DESC (?paintingCount)
```

And here are the top ten results, downloaded as an HTML table from WQS and repasted here:
<table><thead><tr><th>paintingCount</th><th>collectionLabel</th><th>collectionCountryLabel</th></tr></thead><tbody><tr><td>92</td><td>Musée Marmottan Monet</td><td>France</td></tr><tr><td>87</td><td>Musée d'Orsay</td><td>France</td></tr><tr><td>87</td><td>Établissement public du musée d'Orsay et du musée de l'Orangerie</td><td>France</td></tr><tr><td>43</td><td>Metropolitan Museum of Art</td><td>United States of America</td></tr><tr><td>38</td><td>Museum Barberini</td><td>Germany</td></tr><tr><td>38</td><td>Museum of Fine Arts Boston</td><td>United States of America</td></tr><tr><td>35</td><td>Impressionism: The Hasso Plattner Collection</td><td>Germany</td></tr><tr><td>33</td><td>Art Institute of Chicago</td><td>United States of America</td></tr><tr><td>27</td><td>National Gallery of Art</td><td>United States of America</td></tr><tr><td>22</td><td>Philadelphia Museum of Art</td><td>United States of America</td></tr></tbody></table>

What did we learn?
- Paris has significantly more Monet paintings than New York: 179 vs. 43 works in the top ten collections. This difference isn't as clear in web search results.
- I'd probably be more satisfied with the 38 works in the Museum of Fine Arts Boston over the 22 works at the Philadelphia Museum of Art. Surprising to me, that's a few more works than at the [Art Institute of Chicago](https://www.artic.edu/) which is known for its Impressionism collection.
- I've never heard of the [Museum Barberini](https://sammlung.museum-barberini.de/en/) in Germany but it seems like it'd be a good stop if I'm in the area.

Now, this list isn't perfect. For example, "Impressionism: The Hasso Plattner Collection" is located at the Museum Barberini but both are listed here: perhaps if I was more knowledgeable about Wikidata's data representation and SPARQL I could eliminate that. Furthermore, the data set isn't perfect: at the time of writing, [Museum Barberini lists 40 paintings by Monet on their website](https://sammlung.museum-barberini.de/en/?a[]=monet-claude&m[]=l-auf-leinwand) but this query returns 38. However, this dataset is good enough for me to get an idea of where Monet's paintings are.

If you use this as a guide of which museums to visit, remember that not all of these paintings may be "on view" right now: they may be in storage, on loan, etc. Check the collection search of the official museum website to find out what's being displayed.

## Query #2: countries with the most paintings by Monet
([Link to edit/execute query directly in WQS](https://query.wikidata.org/#SELECT%20%28COUNT%28DISTINCT%20%3Fpainting%29%20AS%20%3FpaintingCount%29%20%3FcollectionCountryLabel%20WHERE%20%7B%0A%20%20%3Fpainting%20wdt%3AP170%20wd%3AQ296%3B%20%20%20%20%20%20%20%20%20%20%20%23%20creator%20%3D%20Monet%0A%20%20%20%20wdt%3AP31%20wd%3AQ3305213%3B%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%23%20instanceOf%20%3D%20painting%0A%20%20%20%20%28wdt%3AP195%2F%28wdt%3AP361%2a%29%29%20%3Fcollection.%20%23%20partOf%20a%20collection%0A%20%20OPTIONAL%20%7B%20%3Fcollection%20wdt%3AP17%20%3FcollectionCountry.%20%7D%20%23%20fetch%20collection%20country%0A%20%20SERVICE%20wikibase%3Alabel%20%7B%20bd%3AserviceParam%20wikibase%3Alanguage%20%22%5BAUTO_LANGUAGE%5D%2Cmul%2Cen%22.%20%7D%0A%7D%0AGROUP%20BY%20%3FcollectionCountryLabel%0AORDER%20BY%20DESC%20%28%3FpaintingCount%29))
```sparql
SELECT
  (COUNT(DISTINCT ?painting) AS ?paintingCount)
  ?collectionCountryLabel
WHERE {
  ?painting wdt:P170 wd:Q296;           # creator = Monet
    wdt:P31 wd:Q3305213;                # instanceOf = painting
    (wdt:P195/(wdt:P361*)) ?collection. # partOf a collection
  OPTIONAL { ?collection wdt:P17 ?collectionCountry. } # get collection country
  SERVICE wikibase:label {
    bd:serviceParam wikibase:language "[AUTO_LANGUAGE],mul,en".
  }
}
GROUP BY ?collectionCountryLabel
ORDER BY DESC (?paintingCount)
```
<table><thead><tr><th>paintingCount</th><th>collectionCountryLabel</th></tr></thead><tbody><tr><td>389</td><td>United States of America</td></tr><tr><td>235</td><td>France</td></tr><tr><td>131</td><td></td></tr><tr><td>91</td><td>Japan</td></tr><tr><td>74</td><td>Germany</td></tr><tr><td>53</td><td>United Kingdom</td></tr><tr><td>47</td><td>Switzerland</td></tr><tr><td>25</td><td>Russia</td></tr><tr><td>22</td><td>Netherlands</td></tr><tr><td>11</td><td>Denmark</td></tr></tbody></table>

These are the countries I should focus on if I want to see Monet paintings (the blank field probably indicates paintings in private collections). Curiously, the United States has more paintings than France even though above we learned that Paris has more paintings than New York: it seems like France's Monet collection may be more densely located than the United States' collection.

## Data notes
While these queries worked well for Monet, the data quality between artists can be varied. For example, a less well-known painter like American [Edgar Payne][] has only [6 paintings entered in Wikidata][payne query] (despite [Wikimedia Commons having 133 images of his paintings][commons payne]). In this case, Wikimedia contributors have uploaded many images but have not entered their metadata into Wikidata.

Different fields have varying quality too: there are [997 Monet paintings without the Impressionism movement property][monet no impression] even though [many of them look Impressionist to me][monet no impression images]. This data quality issue would make finding the museums with the largest number of Impressionist paintings difficult.

The Wikimedia resources also have many images of Monet paintings. If you want to see them, you have a few options:
- Add images to your Wikidata query, e.g. [Monet paintings in the Metropolitan Museum of Art][example images]
- Find a list on Wikipedia, e.g. [List of Paintings by Claude Monet](https://en.wikipedia.org/wiki/List_of_paintings_by_Claude_Monet)
- Find a Category on Wikimedia Commons, e.g. [Paintings by Claude Monet](https://commons.wikimedia.org/wiki/Category:Paintings_by_Claude_Monet) & [Paintings by Claude Monet in the Metropolitan Museum of Art](https://commons.wikimedia.org/wiki/Category:Paintings_by_Claude_Monet_in_the_Metropolitan_Museum_of_Art)

Much of Wikidata's data is licensed under CC0 which, as I understand it and I am not a lawyer, means it is dedicated to the public domain: see [Wikidata:Copyright](https://www.wikidata.org/wiki/Wikidata:Copyright) for more information.

I'm impressed with Wikidata's collection of painting information: it's like an IMDB or Goodreads but for paintings. In fact, [the "sum of all paintings" WikiProject](https://www.wikidata.org/wiki/Wikidata:WikiProject_sum_of_all_paintings) has a goal to have a Wikidata item for every notable painting. I'm curious what else I can find out in Wikidata.

[Claude Monet]: https://en.wikipedia.org/wiki/Claude_Monet
[Edgar Payne]: https://en.wikipedia.org/wiki/Edgar_Alwin_Payne

[Musée Marmatton Monet]: https://www.marmottan.fr/en/
[Musée d'Orsay]: https://www.musee-orsay.fr/en
[pma]: https://philamuseum.org/
[mfa]: https://www.mfa.org/

[sparql]: https://www.wikidata.org/wiki/Wikidata:SPARQL_tutorial
[Wikidata]: https://www.wikidata.org/

[payne query]: https://query.wikidata.org/#SELECT%20%28COUNT%28DISTINCT%20%3Fpainting%29%20AS%20%3FpaintingCount%29%20WHERE%20%7B%0A%20%20%3Fpainting%20wdt%3AP170%20wd%3AQ3047478.%0A%20%20SERVICE%20wikibase%3Alabel%20%7B%20bd%3AserviceParam%20wikibase%3Alanguage%20%22%5BAUTO_LANGUAGE%5D%2Cmul%2Cen%22.%20%7D%0A%7D
[commons payne]: https://commons.wikimedia.org/wiki/Category:Paintings_by_Edgar_Payne

[monet no impression]: https://query.wikidata.org/#SELECT%20%28COUNT%28DISTINCT%20%3Fpainting%29%20AS%20%3FpaintingCount%29%20WHERE%20%7B%0A%20%20%3Fpainting%20wdt%3AP31%20wd%3AQ3305213%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20wdt%3AP170%20wd%3AQ296%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%28wdt%3AP195%2F%28wdt%3AP361%2a%29%29%20%3Fcollection.%0A%20%20MINUS%20%7B%20%3Fpainting%20wdt%3AP135%20wd%3AQ40415.%20%7D%0A%20%20SERVICE%20wikibase%3Alabel%20%7B%20bd%3AserviceParam%20wikibase%3Alanguage%20%22%5BAUTO_LANGUAGE%5D%2Cmul%2Cen%2Cfr%22.%20%7D%0A%7D
[monet no impression images]: https://query.wikidata.org/#%23defaultView%3AImageGrid%0ASELECT%20DISTINCT%20%3Fpainting%20%3FpaintingLabel%20%3FcreatorLabel%20%3Fimage%20WHERE%20%7B%0A%20%20%3Fpainting%20wdt%3AP31%20wd%3AQ3305213%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20wdt%3AP170%20wd%3AQ296%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%28wdt%3AP195%2F%28wdt%3AP361%2a%29%29%20%3Fcollection.%0A%20%20MINUS%20%7B%20%3Fpainting%20wdt%3AP135%20wd%3AQ40415.%20%7D%0A%20%20OPTIONAL%20%7B%20%3Fpainting%20wdt%3AP18%20%3Fimage.%20%7D%0A%20%20SERVICE%20wikibase%3Alabel%20%7B%20bd%3AserviceParam%20wikibase%3Alanguage%20%22%5BAUTO_LANGUAGE%5D%2Cmul%2Cen%2Cfr%22.%20%7D%0A%7D%0AORDER%20BY%20%3FcreatorLabel%0ALIMIT%2050
[example images]: https://query.wikidata.org/#%23%20Claude%20Monet%20paintings%20at%20the%20Metropolitan%20Museum%20of%20Art%0A%23defaultView%3AImageGrid%0ASELECT%20DISTINCT%20%3Fpainting%20%3FpaintingLabel%20%3Fimage%20WHERE%20%7B%0A%20%20%3Fpainting%20wdt%3AP31%20wd%3AQ3305213%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20wdt%3AP170%20wd%3AQ296%3B%0A%20%20%20%20%20%20%20%20%20%20%20%20%28wdt%3AP195%2F%28wdt%3AP361%2a%29%29%20%3Fcollection.%0A%20%20FILTER%28%3Fcollection%20%3D%20wd%3AQ160236%29%0A%20%20OPTIONAL%20%7B%20%3Fpainting%20wdt%3AP18%20%3Fimage.%20%7D%0A%20%20SERVICE%20wikibase%3Alabel%20%7B%20bd%3AserviceParam%20wikibase%3Alanguage%20%22%5BAUTO_LANGUAGE%5D%2Cmul%2Cen%2Cfr%22.%20%7D%0A%7D
