import { getPrismaClient } from "utilities/prisma";

const prisma = getPrismaClient();

// The where clause for *many queries
interface SceneWhere {
  id?: string;
  campaignID?: string;
}

// Any additional documents to include in the response
interface SceneInclude {
  campaign: boolean;
}

// The fields that can be used for the creation of a scene
interface SceneCreateInput {
  name: string;
  campaignID?: string; // Required but will be deleted
  config?: any;
}

// The fields that may be modified in a mutation of a scene
interface SceneMutateInput {
  name?: string;
  campaignID?: string;
  config?: any;
}

interface GetScenesArguments {
  where: SceneWhere;
  include: SceneInclude;
}

interface GetSceneArguments {
  id: string;
  include: SceneInclude;
}

interface CreateSceneArguments {
  scene: SceneCreateInput;
  include: SceneInclude;
}

interface MutateSceneArguments {
  id: string;
  scene: SceneMutateInput;
  include: SceneInclude;
}

/**
 * Gets a list of scenes
 * @param where The where clause of the scenes query
 * @param include Any additional documents to include with the response
 * @returns A list of scenes
 */
async function getScenes(_: unknown, { where, include }: GetScenesArguments) {
  return prisma.scene.findMany({ where, include });
}

/**
 * Fetches a single scene document
 * @param id The ID of the scene to fetch
 * @param include Any additional documents to include within the response
 * @returns A scene
 */
async function getScene(_: unknown, { id, include }: GetSceneArguments) {
  return prisma.scene.findUnique({ where: { id }, include });
}

/**
 * Creates a new scene
 * @param scene The new scene to create
 * @param include Any additional documents to return in the response
 * @returns The created scene
 */
async function createScene(_: unknown, { scene, include }: CreateSceneArguments) {
  const campaign = await prisma.campaign.findUnique({ where : { id: scene.campaignID }});
  if (!campaign) { throw "Error!"; }

  delete scene.campaignID;

  return prisma.scene.create({
    data: {
      ...scene as any,
      campaign: { connect: { id: campaign.id }},
    },
    include,
  });
}

/**
 * Mutates a single scene
 * @param id The ID of the scene to mutate
 * @param scene The changes to make to the scene
 * @param include Any additional documents to include
 * @returns The mutated scene
 */
async function mutateScene(_: unknown, { id, scene, include }: MutateSceneArguments) {
  let campaign;
  if (scene.campaignID) {
    campaign = await prisma.campaign.findUnique({ where: { id }});
    if (!campaign) { throw "Error!"; }
  }

  return prisma.scene.update({
    data: {
      ...scene as any,
      campaign: campaign ? { connect: { id: campaign.id }} : undefined,
    },
    where: { id },
    include,
  });
}

 export const sceneResolvers = {
  Query: {
    scenes: getScenes,
    scene: getScene,
  },
  Mutation: {
    createScene,
    mutateScene,
  },
};
