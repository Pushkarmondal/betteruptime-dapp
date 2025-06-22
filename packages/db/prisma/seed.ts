import { PrismaClient, WebsiteTickStatus } from "@prisma/client";
const prismaclient = new PrismaClient();

// Helper to generate tick data
async function createTicksForWebsite(websiteId: string, validatorId: string, statusFn: (i: number) => WebsiteTickStatus) {
  const now = new Date();
  const thirtyMinutesAgo = new Date(now.getTime() - 30 * 60 * 1000);

  for (let i = 0; i <= 30; i++) {
    const tickTime = new Date(thirtyMinutesAgo.getTime() + i * 60 * 1000);
    await prismaclient.websiteTick.create({
      data: {
        id: `tick-${websiteId}-${i}`,
        websiteId,
        validatorId,
        status: statusFn(i),
        latency: Math.floor(Math.random() * 100) + 50,
        createdAt: tickTime,
      },
    });
  }
}

async function seed() {

    await prismaclient.websiteTick.deleteMany();
    await prismaclient.website.deleteMany();
    await prismaclient.validator.deleteMany();
    await prismaclient.user.deleteMany();
  // Create user
  await prismaclient.user.create({
    data: {
      id: "2",
      email: "pushkarmondal@gmail.com",
    },
  });

  // Create validator
  const validator = await prismaclient.validator.create({
    data: {
      id: "2",
      publicKey: "1knokdnc",
      location: "1",
      ip: "1",
    },
  });

  // Website 1: Google - 87% Uptime (26/30 ticks GOOD)
  await prismaclient.website.create({
    data: {
      id: "2",
      url: "https://google.com",
      userId: "2",
    },
  });
  // 26 good, 4 bad (87% uptime)
  await createTicksForWebsite("2", validator.id, (i) =>
    i % 8 === 0 && i < 32 ? WebsiteTickStatus.BAD : WebsiteTickStatus.GOOD
  );

  // Website 2: GitHub - 65% Uptime (20/30 ticks GOOD)
  await prismaclient.website.create({
    data: {
      id: "3",
      url: "https://github.com",
      userId: "2",
    },
  });
  // 20 good, 10 bad (65% uptime)
  await createTicksForWebsite("3", validator.id, (i) =>
    i % 3 === 0 ? WebsiteTickStatus.BAD : WebsiteTickStatus.GOOD
  );

  // Website 3: Twitter - 32% Uptime (10/30 ticks GOOD)
  await prismaclient.website.create({
    data: {
      id: "4",
      url: "https://twitter.com",
      userId: "2",
    },
  });
  // 10 good, 20 bad (33% uptime)
  await createTicksForWebsite("4", validator.id, (i) =>
    i % 3 !== 0 ? WebsiteTickStatus.BAD : WebsiteTickStatus.GOOD
  );
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
