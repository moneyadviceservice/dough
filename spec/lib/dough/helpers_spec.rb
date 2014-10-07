require "spec_helper"

module Dough
  describe Helpers do
    class Foo
      include Dough::Helpers

      attr_reader :text, :renderer

      def initialize(options = {})
        @text = options[:text]
        @renderer = options[:renderer]
      end

      def render(text)
        renderer.render(inline: 'foo', locals: { text: text })
      end
    end

    let(:renderer) { double(:Renderer, render: render) }
    subject(:helper) { Foo.new(helper_name: :inset_block, renderer: renderer, text: 'foo') }

    describe "#method_missing" do
      context "helper found" do
        let(:render) { double(:render, render: '', empty?: false) }

        it "delegates to the correct helper" do
          allow(subject.inset_block).to receive(:render).and_return render
          subject.inset_block('foo').render
        end

      end

      context "helper not found" do
        let(:render) { double(:render, render: '', empty?: true) }

        it "raises the appropriate exception" do
          expect {
            subject.nonexistent_helper('foo').render
          }.to raise_error NameError
        end
      end
    end
  end
end
