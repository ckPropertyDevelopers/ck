interface Media {
  name: string
  caption: string
  alternativeText: string
  url: string
}

interface HomePageData {
  title: string
  landingPageImage: Media
  content: string
  secondaryTitle: string
  secondaryContent: string
  seo: SeoData[]
}
interface SeoData {
  metaTitle: string
  metaDescription: string
  keywords: string[]
  preventIndexing: boolean
}

const createPopulateQuery = (fields: string[]) => {
  return fields.map((field, index) => `populate[${index}]=${field}`).join('&')
}

export default async function getHomePage(): Promise<HomePageData> {
  const query = createPopulateQuery(['landingPageImage', 'seo'])

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/home?${query}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
      },
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Error response:', errorText)
      throw new Error('Failed to fetch homepage data')
    }

    const res = await response.json()

    return {
      title: res.data.title,
      landingPageImage: res.data.landingPageImage,
      content: res.data.content,
      secondaryTitle: res.data.secondaryTitle,
      secondaryContent: res.data.secondaryContent,
      seo: res.data.seo,
    }
  } catch (e) {
    console.error('Fetch error:', e)
    throw e
  }
}
