function Menu({ title, text, btnText, onClick }: { title: string, text:string, btnText:string, onClick: () => void}) {

  return (
    <div className="menu fixed z-[1000] w-screen h-screen bg-black opacity-70 flex flex-col items-center justify-center text-white">
      <h1 className="text-[64px] mb-5">{title}</h1>
      <p className="mb-5 text-[36px]">{text}</p>
      <button className="rounded-xl bg-primary text-[36px] px-10 py-2" onClick={onClick}>{btnText}</button>
    </div>
  );
}

export default Menu;