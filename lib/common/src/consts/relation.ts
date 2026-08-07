export const RelationType = {
  AND: 'and',
  OR: 'or',
} as const;

export type RelationType = typeof RelationType[keyof typeof RelationType];

export const RelationTypeName: Record<RelationType, string> = {
  [RelationType.AND]: '且',
  [RelationType.OR]: '或',
};

export const RelationTypeList = Object.values(RelationType);
