import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.createMany({
    data: [
      // A password decriptada é: jB7vcFKY
      {
        email: "teste@teste.com",
        hashedPassword: "wxkm4Dm1bJ7hufmLKE4qnhSsU/ZROeCjBFFPFJM6me4=",
        salt: "LTw+8t3VgUZ/Gje2gF1Gl40OFpQjRa+z9ugoUFDTNuIx8F0B8gDT42zl5Xclzu5pwzJGmloR3HRMNZvyJhrltc/kfwH6JfbsVHvgNvIT+i7UBlET7A0mgANlnyvjYHLSVPtXrksp1w5edGmT3Ct1cDE/gE5QEx8aR8yK8xt/zMM=",
      },

      // A password decriptada é: BQ2v5Djk
      {
        email: "teste2@teste.com",
        hashedPassword: "GqSR2kHRTuziNa7cI+RFv9CIu29z37tXCm7Jo367/ck=",
        salt: "l0zr416KlSGfRqoC90/pZYbvNJUNGzcKUJKh3gr7oMQF2ppiMuY/b/HfPUXYJGhwtE/qMSjXsC40Pfhk+JBKX2R4jOBvIyG7MtRjnTt0HMoKKU/c4ULTM0DaTq++b6C5hlg+bMs1ds2zJZ57qUcsy6oaMTiedSfdZrP6Md7DPlM=",
      },
    ],
    skipDuplicates: true,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
