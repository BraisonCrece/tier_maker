class CreateTierLists < ActiveRecord::Migration[7.2]
  def change
    create_table :tier_lists do |t|
      t.string :name
      t.string :uuid

      t.timestamps
    end
  end
end
