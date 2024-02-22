require 'spec_helper'

describe Dough::HtmlOptions do
  describe '#classes' do
    it 'defaults to an empty string' do
      expect(described_class.new.classes).to eq('')
    end
  end

  describe 'to_s' do
    subject { described_class.new(id: 'a', classes: 'b c') }

    it 'returns key value pairs in a string' do
      expect(subject.to_s).to eql('id="a" class="b c"')
    end
  end
end
