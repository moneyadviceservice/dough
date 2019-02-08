require 'spec_helper'

describe Dough::Helpers do
  class Foo
    include Dough::Helpers
    include ActionView::Helpers::TagHelper
    include ActionView::Helpers::CaptureHelper

    attr_reader :text, :renderer
    attr_accessor :output_buffer

    def initialize(options = {})
      @text = options[:text]
      @renderer = options[:renderer]
    end

    def render(text)
      renderer.render(inline: 'foo', locals: { text: text })
    end
  end

  subject(:helper) { Foo.new(helper_name: :inset_block, renderer: renderer, text: 'foo') }

  let(:renderer) { double(:Renderer, render: render) }

  describe '#heading_tag' do
    let(:render) { double(:render, render: '', empty?: false) }

    context 'when passing a block' do
      subject(:heading_tag) do
        helper.heading_tag level: 3 do
          'Header'
        end
      end

      it 'returns the header with content in the block and the level' do
        expect(helper).to receive(:content_tag).with('h3', 'Header', 'role' => :heading, 'aria-level' => 3)
        heading_tag
      end
    end

    context 'when passing different heading levels' do
      subject(:heading_tag) do
        helper.heading_tag('Header', level: 2)
      end

      it 'returns the level passed in the options' do
        expect(helper).to receive(:content_tag).with('h2', 'Header', 'role' => :heading, 'aria-level' => 2)
        heading_tag
      end
    end

    context 'when not passing the heading level' do
      subject(:heading_tag) do
        helper.heading_tag('Header')
      end

      it 'returns h1 as default' do
        expect(helper).to receive(:content_tag).with('h1', 'Header', 'role' => :heading, 'aria-level' => 1)
        heading_tag
      end
    end
  end

  describe '#method_missing' do
    context 'helper found' do
      let(:render) { double(:render, render: '', empty?: false) }

      it 'delegates to the correct helper' do
        expect(subject.inset_block(html_content: { heading: 'foo', content: 'bar' }))
          .to receive(:render)
          .and_return render

        subject.inset_block(html_content: { heading: 'foo', content: 'bar' }).render
      end
    end

    context 'helper not found' do
      let(:render) { double(:render, render: '', empty?: true) }

      it 'raises the appropriate exception' do
        expect do
          subject.nonexistent_helper('foo').render
        end.to raise_error NameError
      end
    end
  end
end
