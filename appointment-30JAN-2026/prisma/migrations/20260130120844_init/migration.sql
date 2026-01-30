-- CreateEnum
CREATE TYPE "ROLE" AS ENUM ('USER', 'SERVICE_PROVIDER');

-- CreateEnum
CREATE TYPE "TYPE" AS ENUM ('MEDICAL', 'HOUSE_HELP', 'BEAUTY', 'FITNESS', 'EDUCATION', 'OTHER');

-- CreateEnum
CREATE TYPE "STATUS" AS ENUM ('BOOKED', 'CANCELLED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "ROLE" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "TYPE" NOT NULL,
    "providerId" TEXT NOT NULL,
    "durationMinutes" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Availability" (
    "id" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TIME NOT NULL,
    "endTime" TIME NOT NULL,

    CONSTRAINT "Availability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appointment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "serviceId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "startTime" TIME NOT NULL,
    "endTime" TIME NOT NULL,
    "slotId" TEXT NOT NULL,
    "status" "STATUS" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_slotId_key" ON "Appointment"("slotId");

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Availability" ADD CONSTRAINT "Availability_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
