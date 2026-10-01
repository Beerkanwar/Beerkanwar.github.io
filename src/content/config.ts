import { defineCollection, z } from 'astro:content';

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    track: z.enum(['gameplay', 'systems', 'both']),
    tier: z.enum(['featured', 'side']),
    canonicalStage: z.string(),
    orderDefault: z.number(),
    orderGameplay: z.number(),
    orderSystems: z.number(),
    statuses: z.array(
      z.enum([
        'SHIPPED',
        'PLAYABLE',
        'JAM',
        'PROTOTYPE',
        'TUTORIAL-BASED',
        'TEMPLATE-BASED',
      ])
    ),
    hook: z.string(),
    mission: z.string(),
    keySystems: z.array(
      z.object({
        title: z.string(),
        detail: z.string(),
      })
    ),
    bossFight: z
      .object({
        title: z.string(),
        detail: z.string(),
      })
      .optional(),
    loot: z.array(z.string()).optional(),
    scopeNote: z
      .object({
        baseName: z.string(),
        providedByBase: z.array(z.string()),
        builtByMe: z.array(z.string()),
      })
      .optional(),
    stack: z.array(z.string()),
    role: z.string(),
    timeline: z.string(),
    platform: z.string(),
    teamSize: z.string(),
    links: z.object({
      repo: z.string().url().optional(),
      playStore: z.string().url().optional(),
      itch: z.string().url().optional(),
      itchEmbedUrl: z.string().url().optional(),
      video: z.string().url().optional(),
    }),
    controlsText: z.string().optional(),
    relatedProject: z
      .object({
        title: z.string(),
        slug: z.string(),
        relation: z.string(),
      })
      .optional(),
    media: z.object({
      poster: z.string(),
      clipWebm: z.string().optional(),
      clipMp4: z.string().optional(),
      architectureSvgId: z.string().optional(),
      gallery: z.array(
        z.object({
          src: z.string(),
          alt: z.string(),
          caption: z.string(),
        })
      ),
    }),
  }),
});

const questsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    order: z.number(),
    title: z.string(),
    organization: z.string(),
    location: z.string(),
    dateRange: z.string(),
    stamp: z.string().default('QUEST COMPLETE'),
    bullets: z.array(z.string()),
    links: z
      .array(
        z.object({
          label: z.string(),
          url: z.string(),
        })
      )
      .optional(),
  }),
});

const wipCollection = defineCollection({
  type: 'content',
  schema: z.object({
    order: z.number(),
    title: z.string(),
    slug: z.string(),
    track: z.enum(['gameplay', 'systems', 'both']),
    phase: z.enum(['Plan', 'Prototype', 'Alpha', 'Release']),
    phaseNote: z.string(),
    hook: z.string(),
    whatItIs: z.string(),
    stack: z.array(z.string()),
    platforms: z.string(),
    architectureHighlights: z.array(z.string()),
    doneSoFar: z.array(z.string()),
    currentFocus: z.string(),
    nextMilestone: z.string(),
    plannedFeaturesNote: z.string(),
    devLog: z.array(
      z.object({
        date: z.string(),
        entry: z.string(),
      })
    ),
    links: z
      .array(
        z.object({
          label: z.string(),
          url: z.string(),
        })
      )
      .optional(),
  }),
});

export const collections = {
  projects: projectsCollection,
  quests: questsCollection,
  wip: wipCollection,
};
