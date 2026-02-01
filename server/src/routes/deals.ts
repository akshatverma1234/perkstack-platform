import express, { Response } from 'express'
import { Deal } from '../models/Deal'
import { Claim } from '../models/Claim'
import { authenticate, AuthRequest } from '../middleware/auth'

const router = express.Router()

router.get('/', async (req: AuthRequest, res: Response) => {
    try {
        const deals = await Deal.find({})
        res.send(deals)
    } catch (err) {
        res.status(500).send({ error: 'Failed to fetch deals' })
    }
})

router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const deal = await Deal.findById(req.params.id)
        if (!deal) {
            res.status(404).send({ error: 'Deal not found' })
            return
        }
        res.send(deal)
    } catch (err) {
        res.status(500).send({ error: 'Failed to fetch deal' })
    }
})

router.post('/:id/claim', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user
        if (!user) {
            res.status(401).send({ error: 'User not found' })
            return
        }

        const deal = await Deal.findById(req.params.id)
        if (!deal) {
            res.status(404).send({ error: 'Deal not found' })
            return
        }

        if (deal.isLocked) {
            const claims = await Claim.findOne({ userId: user.userId, dealId: deal._id })
            if (claims) {
                res.status(400).send({ error: 'Already claimed' })
                return
            }
        }

        const claim = new Claim({
            userId: user.userId,
            dealId: deal._id,
            status: 'approved',
            claimCode: 'CLAIM-' + Math.random().toString(36).substr(2, 9).toUpperCase()
        })

        await claim.save()
        res.status(201).send(claim)
    } catch (err) {
        res.status(400).send({ error: 'Claim failed' })
    }
})

router.get('/user/claims', authenticate, async (req: AuthRequest, res: Response) => {
    try {
        const user = req.user!
        const claims = await Claim.find({ userId: user.userId }).populate('dealId')
        res.send(claims)
    } catch (err) {
        res.status(500).send({ error: 'Failed to fetch claims' })
    }
})

router.post('/seed', async (req, res) => {
    try {
        await Deal.deleteMany({})
        const deals = [
            {
                title: 'AWS Credits',
                description: '$5000 in AWS Cloud Credits for 2 years. Keep your startup running with the world\'s leading cloud provider.',
                partnerName: 'AWS',
                category: 'Cloud',
                isLocked: true,
                logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/93/Amazon_Web_Services_Logo.svg',
                discountValue: '$5000 Credits',
                conditions: 'Valid for new accounts only. Must optionally have raised funding.'
            },
            {
                title: 'Notion Plus',
                description: '6 Months Free on Notion Plus Plan. Organize your work and knowledge in one place.',
                partnerName: 'Notion',
                category: 'Productivity',
                isLocked: false,
                logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png',
                discountValue: '6 Months Free',
                conditions: 'New workspaces only.'
            },
            {
                title: 'HubSpot for Startups',
                description: '90% off HubSpot for eligible startups. Powerful CRM and marketing tools to grow your business.',
                partnerName: 'HubSpot',
                category: 'Marketing',
                isLocked: true,
                logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/15/HubSpot_Logo.png',
                discountValue: '90% Off',
                conditions: 'Must be a venture-backed startup.'
            },
            {
                title: 'Miro Team',
                description: '$1000 credit for Miro Team Plan. The online collaborative whiteboard platform.',
                partnerName: 'Miro',
                category: 'Productivity',
                isLocked: false,
                logoUrl: 'https://cdn.worldvectorlogo.com/logos/miro-2.svg',
                discountValue: '$1000 Credit',
                conditions: 'Valid for new teams.'
            },
            {
                title: 'Google Cloud',
                description: 'Up to $200,000 in Google Cloud credits. Scale your infrastructure with Google\'s powerful tools.',
                partnerName: 'Google Cloud',
                category: 'Cloud',
                isLocked: true,
                logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/5/51/Google_Cloud_logo.svg',
                discountValue: '$200k Credits',
                conditions: 'Series A or higher.'
            },
            {
                title: 'Linear',
                description: '6 Months free on the Standard plan. Issue tracking built for high-performance engineering teams.',
                partnerName: 'Linear',
                category: 'Productivity',
                isLocked: false,
                logoUrl: 'https://cdn.worldvectorlogo.com/logos/linear.svg',
                discountValue: '6 Months Free',
                conditions: 'New workspaces only.'
            },
            {
                title: 'Segment',
                description: '$50,000 in annual credits for Segment Team Plan. Collect, clean, and control your customer data.',
                partnerName: 'Segment',
                category: 'Analytics',
                isLocked: true,
                logoUrl: 'https://cdn.worldvectorlogo.com/logos/segment.svg',
                discountValue: '$50k Credits',
                conditions: 'Early stage startups only.'
            },
            {
                title: 'Mixpanel',
                description: '$50,000 in credits for one year. Powerful self-serve product analytics to help you convert, engage, and retain more users.',
                partnerName: 'Mixpanel',
                category: 'Analytics',
                isLocked: false,
                logoUrl: 'https://cdn.worldvectorlogo.com/logos/mixpanel.svg',
                discountValue: '$50k Credits',
                conditions: 'New customers only.'
            },
            {
                title: 'Vercel',
                description: '$2,000 in credits for Pro or Enterprise plans. Develop. Preview. Ship.',
                partnerName: 'Vercel',
                category: 'DevTools',
                isLocked: false,
                logoUrl: 'https://assets.vercel.com/image/upload/v1588805858/repositories/vercel/logo.png',
                discountValue: '$2000 Credits',
                conditions: 'New teams only.'
            },
            {
                title: 'Stripe',
                description: '$50,000 in volume fee-free processing. Financial infrastructure for the internet.',
                partnerName: 'Stripe',
                category: 'Finance',
                isLocked: true,
                logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg',
                discountValue: 'Fee-Free Processing',
                conditions: 'New accounts only.'
            },
            {
                title: 'OpenAI',
                description: '$2500 in API credits. Build next-gen apps with GPT-4 and more.',
                partnerName: 'OpenAI',
                category: 'AI',
                isLocked: true,
                logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4d/OpenAI_Logo.svg',
                discountValue: '$2500 Credits',
                conditions: 'Application required.'
            },
            {
                title: 'Typeform',
                description: '6 months free on the Plus plan. Create forms and surveys that people enjoy answering.',
                partnerName: 'Typeform',
                category: 'Marketing',
                isLocked: false,
                logoUrl: 'https://upload.wikimedia.org/wikipedia/commons/f/f7/Typeform_Logo.svg',
                discountValue: '6 Months Free',
                conditions: 'New users only.'
            }
        ]
        await Deal.insertMany(deals)
        res.send({ message: 'Seeded' })
    } catch (err) {
        res.status(500).send({ error: err })
    }
})

export default router
