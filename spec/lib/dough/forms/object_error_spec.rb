require 'spec_helper'

RSpec.describe Dough::Forms::ObjectError do
  describe '#full_message' do
    subject(:object_error) do
      described_class.new(
        field_name: :age,
        message: 'is invalid'
      )
    end

    subject(:full_message) do
      object_error.full_message
    end

    context 'when show error WITHOUT field name' do
      before do
        expect(object_error).to receive(:show_message_without_field_name?).and_return(true)
      end

      it 'returns error message without field name' do
        expect(full_message).to eq('is invalid')
      end
    end

    context 'when show error with field name' do
      it 'returns error message with the field name' do
        expect(full_message).to eq('Age is invalid')
      end
    end
  end
end
