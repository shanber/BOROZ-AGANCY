import { prisma } from './prisma';
import bcrypt from 'bcryptjs';

/**
 * Helper function to hash passwords
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

/**
 * Helper function to verify passwords
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Helper function to find user by email
 */
export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    include: {
      orgMembers: {
        include: {
          organization: true,
        },
      },
    },
  });
}

/**
 * Helper function to create a new user with organization
 */
export async function createUserWithOrg(
  email: string,
  password: string,
  name: string,
  orgName: string
) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      isActive: true,
    },
  });

  // Create organization
  const org = await prisma.organization.create({
    data: {
      name: orgName,
      slug: orgName.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
    },
  });

  // Add user as SUPER_ADMIN to organization
  await prisma.organizationMember.create({
    data: {
      userId: user.id,
      orgId: org.id,
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  });

  // Create default subscription plan
  await prisma.organizationPlan.create({
    data: {
      orgId: org.id,
      plan: 'FREE',
      monthlyLimit: 10,
      currentMonth: 0,
    },
  });

  return { user, org };
}

/**
 * Get user with organizations
 */
export async function getUserWithOrgs(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      orgMembers: {
        include: {
          organization: {
            include: {
              plan: true,
            },
          },
        },
      },
    },
  });
}

/**
 * Check if user has role in organization
 */
export function hasRole(
  userRole: string | undefined,
  allowedRoles: string[]
): boolean {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
}

/**
 * Check if user is admin
 */
export function isAdmin(userRole: string | undefined): boolean {
  return hasRole(userRole, ['SUPER_ADMIN', 'ADMIN']);
}
