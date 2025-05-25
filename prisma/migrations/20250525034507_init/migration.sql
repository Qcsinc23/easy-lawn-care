-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "clerk_user_id" TEXT NOT NULL,
    "phone_number" TEXT,
    "notification_preference" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2),
    "features" JSONB,
    "includes_media" BOOLEAN NOT NULL DEFAULT false,
    "is_custom" BOOLEAN NOT NULL DEFAULT false,
    "display_order" SMALLINT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" TEXT NOT NULL,
    "clerk_user_id" TEXT NOT NULL,
    "street_address" TEXT NOT NULL,
    "area" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "postal_code" TEXT,
    "country" TEXT NOT NULL DEFAULT 'Guyana',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "clerk_user_id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "address_id" TEXT NOT NULL,
    "booking_date" DATE NOT NULL,
    "booking_time" TIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Scheduled',
    "price_at_booking" DECIMAL(10,2) NOT NULL,
    "customer_notes" TEXT,
    "stripe_checkout_session_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "booking_media" (
    "id" TEXT NOT NULL,
    "booking_id" TEXT NOT NULL,
    "storage_path" TEXT NOT NULL,
    "file_type" TEXT,
    "media_type" TEXT NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "booking_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "custom_assessments" (
    "id" TEXT NOT NULL,
    "clerk_user_id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "address_id" TEXT NOT NULL,
    "preferred_date" DATE NOT NULL,
    "preferred_time" TEXT NOT NULL,
    "assessment_data" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "custom_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_clerk_user_id_key" ON "profiles"("clerk_user_id");

-- CreateIndex
CREATE INDEX "profiles_clerk_user_id_idx" ON "profiles"("clerk_user_id");

-- CreateIndex
CREATE INDEX "addresses_clerk_user_id_idx" ON "addresses"("clerk_user_id");

-- CreateIndex
CREATE UNIQUE INDEX "bookings_stripe_checkout_session_id_key" ON "bookings"("stripe_checkout_session_id");

-- CreateIndex
CREATE INDEX "bookings_clerk_user_id_idx" ON "bookings"("clerk_user_id");

-- CreateIndex
CREATE INDEX "custom_assessments_clerk_user_id_idx" ON "custom_assessments"("clerk_user_id");

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_clerk_user_id_fkey" FOREIGN KEY ("clerk_user_id") REFERENCES "profiles"("clerk_user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_clerk_user_id_fkey" FOREIGN KEY ("clerk_user_id") REFERENCES "profiles"("clerk_user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_media" ADD CONSTRAINT "booking_media_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_assessments" ADD CONSTRAINT "custom_assessments_clerk_user_id_fkey" FOREIGN KEY ("clerk_user_id") REFERENCES "profiles"("clerk_user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_assessments" ADD CONSTRAINT "custom_assessments_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_assessments" ADD CONSTRAINT "custom_assessments_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

