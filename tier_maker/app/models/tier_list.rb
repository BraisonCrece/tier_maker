class TierList < ApplicationRecord
  before_create :generate_uuid

  has_many_attached :images

  private

  def generate_uuid
    self.uuid = SecureRandom.uuid
  end

  def images_urls
    images.map { |image| Rails.application.routes.url_helpers.rails_blob_path(image, only_path: true) }
  end
end
