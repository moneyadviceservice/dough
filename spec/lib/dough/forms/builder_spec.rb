require 'spec_helper'

RSpec.describe Dough::Forms::Builder do
  class CustomModel
    include ActiveModel::Validations

    attr_accessor :name
    validates :name, presence: true
  end

  subject(:builder) { described_class.new(:model, model, {}, {}) }
  let(:model) { CustomModel.new }

  describe '#errors_summary' do
    subject(:errors_summary) { builder.errors_summary }

    context 'when is invalid' do
      before do
        model.name = nil
        model.valid?
      end

      it 'displays summary title' do
        expect(errors_summary).to include(
          I18n.t('dough.forms.validation.summary.title', locale: :en)
        )
      end

      it 'displays the error message' do
        expect(errors_summary).to include("Name can't be blank")
      end
    end

    context 'when is valid' do
      before do
        model.name = 'My real name'
        model.valid?
      end

      it 'returns empty summary' do
        expect(errors_summary).to be_nil
      end
    end
  end

  describe '#errors_summary_partial_name' do
    it 'returns the name of the partial' do
      expect(subject.errors_summary_partial_name).to eq('errors_summary')
    end
  end
end
