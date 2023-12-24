import {createClient} from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
    projectId: "orujgmse",
    dataset: 'production',
    apiVersion: '2021-11-16',
    useCdn: true,
    token: "skif8aebPPkkSe83UzsSixos17rdEZCa2mSp2pjyJgDTlB86ZFE8DIJn544UhRu6wn0RX6oYAPCd0pMtwRhPZDsQReA2KtdH5ZfdwVZRZ08qNlmO8FOnsUolXL2kLZyKaGxX5KcRHc302466pM8ckHK7PdZNROsR8TqKBbFZOKcvAAQuNaRU"  
})

const builder = imageUrlBuilder(client);

export const urlFor = (source) => builder.image(source)