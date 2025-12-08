import { PrismaClient, Prisma } from "../generated/prisma/client";
import { initialData } from '../src/seed/initialData';
import { countries } from '../src/seed/seed-countries';
import { PrismaPg } from '@prisma/adapter-pg'
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import 'dotenv/config'

const scryptAsync = promisify(scrypt);

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
})

const prisma = new PrismaClient({
    adapter,
});

const categoriesData: Prisma.CategoryCreateInput[] = initialData.categories.map(
    (category) => ({
        name: category,
    })
);

const productData: Prisma.ProductCreateInput[] = initialData.products.map(
    (product) => ({
        title: product.title,
        description: product.description,
        price: product.price,
        slug: product.slug,
        tags: product.tags,
        templateType: product.templateType,
        demoUrl: product.demoUrl,
        features: product.features,
        formFields: product.formFields,
        category: {
            connectOrCreate: {
                where: { name: product.type },
                create: { name: product.type },
            },
        },
        productImages: {
            create: product.images.map((image) => ({ url: image })),
        },
    })
);

// Función para hashear contraseñas con scrypt (igual que Better Auth)
async function hashPassword(password: string): Promise<string> {
    const salt = randomBytes(16).toString('hex');
    const derivedKey = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${salt}:${derivedKey.toString('hex')}`;
}



export async function main() {
    try {
        // Limpiar datos existentes
        
        await prisma.orderAddress.deleteMany();
        await prisma.orderItem.deleteMany();
        await prisma.order.deleteMany();
        await prisma.userAddress.deleteMany();
        await prisma.account.deleteMany();
        await prisma.session.deleteMany();
        await prisma.user.deleteMany();
        await prisma.productImage.deleteMany();
        await prisma.product.deleteMany();
        await prisma.category.deleteMany();
        await prisma.country.deleteMany();

        // Insertar países
        await prisma.country.createMany({
            data: countries
        });

        // Insertar categorías
        await prisma.category.createMany({
            data: categoriesData
        });

        // Insertar productos
        for (const product of productData) {
            await prisma.product.create({ data: product });
        }

        // Insertar usuarios con contraseñas hasheadas
        for (const user of initialData.users) {
            const hashedPassword = await hashPassword(user.password);
            
            // Crear usuario
            const createdUser = await prisma.user.create({
                data: {
                    name: user.name,
                    email: user.email,
                    password: hashedPassword,
                    role: user.role,
                    image: user.image,
                    emailVerified: true, // Marcar como verificado
                }
            });

            // Crear cuenta credential (requerido por Better Auth)
            await prisma.account.create({
                data: {
                    userId: createdUser.id,
                    accountId: createdUser.id,
                    providerId: 'credential',
                    password: hashedPassword,
                }
            });
        }

        console.log('Seed ejecutado correctamente');
        console.log('Usuarios creados:');
        initialData.users.forEach(user => {
            console.log(`   - ${user.email} (${user.role}) - Password: ${user.password}`);
        });
    } catch (error) {
        console.log('Error al ejecutar el seed:', error);
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });